import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const HEADERS = ["Order ID", "Order date", "Customer name", "Phone", "Email", "Delivery address", "Product", "Product slug", "Quantity", "Unit price", "Subtotal", "Delivery fee", "Order total", "Payment method", "Order status", "Request ID", "Email status"];

process.stdout.write("Ready for HIMA integration JSON on stdin (input is hidden).\n");
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");
process.stdin.resume();
const input = await new Promise((resolve, reject) => {
  let buffer = "";
  const timer = setTimeout(() => { cleanup(); reject(new Error("Timed out waiting for integration configuration.")); }, 120000);
  const cleanup = () => { clearTimeout(timer); process.stdin.off("data", onData); };
  const onData = (chunk) => {
    buffer += chunk;
    const newline = buffer.search(/[\r\n]/);
    if (newline >= 0) { cleanup(); resolve(buffer.slice(0, newline)); }
  };
  process.stdin.on("data", onData);
});
if (process.stdin.isTTY) process.stdin.setRawMode(false);
process.stdin.pause();

try {
  const config = JSON.parse(input.trim());
  const required = ["privateKey", "clientEmail", "sheetId", "smtpUser", "smtpPass", "businessEmail"];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) throw new Error(`Missing configuration fields: ${missing.join(", ")}`);

  const privateKey = String(config.privateKey).replace(/\\n/g, "\n");
  const tab = String(config.sheetTab || "Orders");
  const auth = new google.auth.JWT({ email: config.clientEmail, key: privateKey, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const metadata = await sheets.spreadsheets.get({ spreadsheetId: config.sheetId, fields: "sheets(properties(sheetId,title,gridProperties),bandedRanges(bandedRangeId,range),conditionalFormats)" });
  let sheet = metadata.data.sheets?.find((item) => item.properties?.title === tab);
  if (!sheet) {
    const created = await sheets.spreadsheets.batchUpdate({ spreadsheetId: config.sheetId, requestBody: { requests: [{ addSheet: { properties: { title: tab, gridProperties: { rowCount: 1000, columnCount: HEADERS.length, frozenRowCount: 1 } } } }] } });
    sheet = created.data.replies?.[0]?.addSheet;
  }
  const sheetId = sheet?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) throw new Error("The Orders worksheet could not be prepared.");
  const rowCount = Math.max(1000, sheet.properties?.gridProperties?.rowCount || 0);
  await sheets.spreadsheets.values.update({ spreadsheetId: config.sheetId, range: `'${tab.replaceAll("'", "''")}'!A1:Q1`, valueInputOption: "RAW", requestBody: { values: [HEADERS] } });

  const requests = [
    { updateSpreadsheetProperties: { properties: { timeZone: "Asia/Kathmandu" }, fields: "timeZone" } },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1, hideGridlines: true }, tabColorStyle: { rgbColor: { red: .71, green: .54, blue: .27 } } }, fields: "gridProperties(frozenRowCount,frozenColumnCount,hideGridlines),tabColorStyle" } },
    { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length }, cell: { userEnteredFormat: { backgroundColor: { red: .11, green: .10, blue: .08 }, textFormat: { foregroundColor: { red: .91, green: .75, blue: .45 }, bold: true, fontFamily: "Arial", fontSize: 11 }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE", wrapStrategy: "WRAP", padding: { top: 9, bottom: 9, left: 7, right: 7 }, borders: { bottom: { style: "SOLID_THICK", color: { red: .83, green: .70, blue: .47 } } } } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: HEADERS.length }, cell: { userEnteredFormat: { backgroundColor: { red: .99, green: .98, blue: .96 }, textFormat: { foregroundColor: { red: .12, green: .11, blue: .09 }, fontFamily: "Arial", fontSize: 10 }, verticalAlignment: "MIDDLE", wrapStrategy: "CLIP", padding: { top: 7, bottom: 7, left: 8, right: 8 }, borders: { bottom: { style: "SOLID", color: { red: .86, green: .83, blue: .77 } } } } }, fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy,padding,borders)" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 8, endColumnIndex: 9 }, cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "0" }, horizontalAlignment: "CENTER" } }, fields: "userEnteredFormat(numberFormat,horizontalAlignment)" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 9, endColumnIndex: 13 }, cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: '"NPR" #,##0' }, horizontalAlignment: "RIGHT" } }, fields: "userEnteredFormat(numberFormat,horizontalAlignment)" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 3, endColumnIndex: 4 }, cell: { userEnteredFormat: { numberFormat: { type: "TEXT", pattern: "@" }, horizontalAlignment: "CENTER" } }, fields: "userEnteredFormat(numberFormat,horizontalAlignment)" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 14, endColumnIndex: 15 }, cell: { dataValidation: { condition: { type: "ONE_OF_LIST", values: ["Order received", "Phone confirmed", "Preparing", "Dispatched", "Delivered", "Cancelled"].map((userEnteredValue) => ({ userEnteredValue })) }, strict: true, showCustomUi: true } }, fields: "dataValidation" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 48 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 1, endIndex: rowCount }, properties: { pixelSize: 40 }, fields: "pixelSize" } },
    { setBasicFilter: { filter: { range: { sheetId, startRowIndex: 0, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: HEADERS.length } } } },
  ];
  [190,155,175,125,215,300,180,170,85,115,115,110,125,135,140,250,240].forEach((pixelSize, index) => requests.push({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } }));
  requests.push(
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 }, properties: { hiddenByUser: true }, fields: "hiddenByUser" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 15, endIndex: 16 }, properties: { hiddenByUser: true }, fields: "hiddenByUser" } },
  );
  sheet.bandedRanges?.forEach((band) => { if (band.bandedRangeId !== null && band.bandedRangeId !== undefined) requests.push({ deleteBanding: { bandedRangeId: band.bandedRangeId } }); });
  for (let index = (sheet.conditionalFormats?.length || 0) - 1; index >= 0; index -= 1) requests.push({ deleteConditionalFormatRule: { sheetId, index } });
  const statusRange = { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 14, endColumnIndex: 15 };
  const statusStyles = [
    ["Order received", { red: .98, green: .91, blue: .72 }, { red: .45, green: .30, blue: .05 }],
    ["Phone confirmed", { red: .82, green: .91, blue: .98 }, { red: .08, green: .31, blue: .50 }],
    ["Preparing", { red: .90, green: .85, blue: .97 }, { red: .34, green: .18, blue: .53 }],
    ["Dispatched", { red: .99, green: .86, blue: .72 }, { red: .55, green: .25, blue: .05 }],
    ["Delivered", { red: .82, green: .94, blue: .84 }, { red: .08, green: .38, blue: .16 }],
    ["Cancelled", { red: .98, green: .82, blue: .82 }, { red: .55, green: .08, blue: .08 }],
  ];
  statusStyles.forEach(([value, backgroundColor, foregroundColor], index) => requests.push({ addConditionalFormatRule: { index, rule: { ranges: [statusRange], booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: value }] }, format: { backgroundColor, textFormat: { foregroundColor, bold: true } } } } } }));
  requests.push({ addConditionalFormatRule: { index: statusStyles.length, rule: { ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 16, endColumnIndex: 17 }], booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "Business and customer emails sent" }] }, format: { backgroundColor: { red: .82, green: .94, blue: .84 }, textFormat: { foregroundColor: { red: .08, green: .38, blue: .16 }, bold: true } } } } } });
  requests.push({ addConditionalFormatRule: { index: statusStyles.length + 1, rule: { ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: HEADERS.length }], booleanRule: { condition: { type: "CUSTOM_FORMULA", values: [{ userEnteredValue: "=ISEVEN(ROW())" }] }, format: { backgroundColor: { red: .95, green: .93, blue: .89 } } } } } });
  await sheets.spreadsheets.batchUpdate({ spreadsheetId: config.sheetId, requestBody: { requests } });

  const smtpPass = String(config.smtpPass).replace(/\s/g, "");
  const transporter = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: config.smtpUser, pass: smtpPass } });
  await transporter.verify();

  const signingSecret = createHash("sha256").update(`${privateKey}:${config.sheetId}`).digest("hex");
  const environment = { ...process.env, GOOGLE_SHEET_ID: String(config.sheetId), GOOGLE_SHEET_TAB_NAME: tab, GOOGLE_SERVICE_ACCOUNT_EMAIL: String(config.clientEmail), GOOGLE_PRIVATE_KEY: privateKey, SMTP_HOST: "smtp.gmail.com", SMTP_PORT: "465", SMTP_USER: String(config.smtpUser), SMTP_PASS: smtpPass, EMAIL_FROM: `HIMA Watches <${config.smtpUser}>`, BUSINESS_EMAIL: String(config.businessEmail), BRAND_NAME: "HIMA Watches", FRONTEND_URL: "http://localhost:3000", NEXT_PUBLIC_SITE_URL: "http://localhost:3000", ORDER_SIGNING_SECRET: signingSecret };
  const envValue = (value) => JSON.stringify(String(value));
  const environmentFile = [
    "# HIMA Watches server-only configuration",
    `GOOGLE_SHEET_ID=${envValue(config.sheetId)}`,
    `GOOGLE_SHEET_TAB_NAME=${envValue(tab)}`,
    `GOOGLE_SERVICE_ACCOUNT_EMAIL=${envValue(config.clientEmail)}`,
    `GOOGLE_PRIVATE_KEY=${envValue(privateKey)}`,
    `SMTP_HOST=${envValue("smtp.gmail.com")}`,
    `SMTP_PORT=${envValue("465")}`,
    `SMTP_USER=${envValue(config.smtpUser)}`,
    `SMTP_PASS=${envValue(smtpPass)}`,
    `EMAIL_FROM=${envValue(`HIMA Watches <${config.smtpUser}>`)}`,
    `BUSINESS_EMAIL=${envValue(config.businessEmail)}`,
    `BRAND_NAME=${envValue("HIMA Watches")}`,
    `FRONTEND_URL=${envValue("http://localhost:3000")}`,
    `NEXT_PUBLIC_SITE_URL=${envValue("http://localhost:3000")}`,
    `ORDER_SIGNING_SECRET=${envValue(signingSecret)}`,
    "",
  ].join("\n");
  writeFileSync(resolve(process.cwd(), ".env.local"), environmentFile, { encoding: "utf8", mode: 0o600 });
  process.stdout.write("Google Sheet formatted, Gmail SMTP verified, and server configuration saved. Starting HIMA Watches.\n");
  const child = spawn("npm", ["start", "--", "--hostname", "0.0.0.0", "--port", "3000"], { cwd: process.cwd(), env: environment, stdio: "inherit", windowsHide: true, shell: process.platform === "win32" });
  child.on("exit", (code) => process.exit(code ?? 0));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown integration error";
  process.stderr.write(`Integration setup failed: ${message}\n`);
  process.exit(1);
}
