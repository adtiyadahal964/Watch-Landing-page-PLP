import "server-only";
import { google } from "googleapis";
import type { OrderInput } from "./order-schema";

const HEADERS = ["Order ID", "Order date", "Customer name", "Phone", "Email", "Delivery address", "Product", "Product slug", "Quantity", "Unit price", "Subtotal", "Delivery fee", "Order total", "Payment method", "Order status", "Request ID", "Email status"];
let sheetSetup: Promise<{ sheetId: number }> | null = null;

export type StoredOrder = {
  orderId: string; dateTime: string; productName: string; productSlug: string;
  quantity: number; pricePerPiece: number; subtotal: number; deliveryFee: number;
  totalPrice: number; paymentMethod: string; status: string; notificationStatus: string;
};

function settings() {
  const names = ["GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"] as const;
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Server configuration is incomplete: ${missing.join(", ")}`);
  return { spreadsheetId: process.env.GOOGLE_SHEET_ID!, tab: process.env.GOOGLE_SHEET_TAB_NAME || "Orders" };
}

function client() {
  const auth = new google.auth.JWT({ email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  return google.sheets({ version: "v4", auth });
}

function storedNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function ensureOrdersSheet() {
  if (!sheetSetup) sheetSetup = setupOrdersSheet().catch((error) => { sheetSetup = null; throw error; });
  return sheetSetup;
}

async function setupOrdersSheet() {
  const { spreadsheetId, tab } = settings();
  const sheets = client();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets(properties(sheetId,title,gridProperties),bandedRanges(bandedRangeId,range),conditionalFormats)" });
  let sheet = metadata.data.sheets?.find((item) => item.properties?.title === tab);
  if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
    const created = await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: tab, gridProperties: { rowCount: 1000, columnCount: HEADERS.length, frozenRowCount: 1 } } } }] } });
    sheet = created.data.replies?.[0]?.addSheet;
  }
  if (!sheet) throw new Error("Could not prepare the Orders worksheet.");
  const sheetId = sheet?.properties?.sheetId;
  if (sheetId === null || sheetId === undefined) throw new Error("Could not prepare the Orders worksheet.");
  const rowCount = Math.max(1000, sheet.properties?.gridProperties?.rowCount || 0);
  await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${tab.replaceAll("'", "''")}'!A1:Q1`, valueInputOption: "RAW", requestBody: { values: [HEADERS] } });

  const requests: Array<Record<string, unknown>> = [
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
  const widths = [190, 155, 175, 125, 215, 300, 180, 170, 85, 115, 115, 110, 125, 135, 140, 250, 240];
  widths.forEach((pixelSize, index) => requests.push({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } }));
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
  ] as const;
  statusStyles.forEach(([value, backgroundColor, foregroundColor], index) => requests.push({ addConditionalFormatRule: { index, rule: { ranges: [statusRange], booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: value }] }, format: { backgroundColor, textFormat: { foregroundColor, bold: true } } } } } }));
  requests.push({ addConditionalFormatRule: { index: statusStyles.length, rule: { ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 16, endColumnIndex: 17 }], booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "Business and customer emails sent" }] }, format: { backgroundColor: { red: .82, green: .94, blue: .84 }, textFormat: { foregroundColor: { red: .08, green: .38, blue: .16 }, bold: true } } } } } });
  requests.push({ addConditionalFormatRule: { index: statusStyles.length + 1, rule: { ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: HEADERS.length }], booleanRule: { condition: { type: "CUSTOM_FORMULA", values: [{ userEnteredValue: "=ISEVEN(ROW())" }] }, format: { backgroundColor: { red: .95, green: .93, blue: .89 } } } } } });
  await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
  return { sheetId };
}

async function findOrderEntry(orderId: string): Promise<{ record: StoredOrder; rowNumber: number } | null> {
  await ensureOrdersSheet();
  const { spreadsheetId, tab } = settings();
  const result = await client().spreadsheets.values.get({
    spreadsheetId,
    range: `'${tab.replaceAll("'", "''")}'!A2:Q`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  const rows = result.data.values || [];
  const rowIndex = rows.findIndex((values) => values[0] === orderId);
  if (rowIndex < 0) return null;
  const row = rows[rowIndex];
  return { rowNumber: rowIndex + 2, record: { orderId: String(row[0]), dateTime: String(row[1]), productName: String(row[6]), productSlug: String(row[7]), quantity: storedNumber(row[8]), pricePerPiece: storedNumber(row[9]), subtotal: storedNumber(row[10]), deliveryFee: storedNumber(row[11]), totalPrice: storedNumber(row[12]), paymentMethod: String(row[13]), status: String(row[14]), notificationStatus: String(row[16] || "Not confirmed") } };
}

export async function findOrderById(orderId: string): Promise<StoredOrder | null> {
  return (await findOrderEntry(orderId))?.record || null;
}

export async function saveOrder(orderId: string, dateTime: string, order: OrderInput) {
  const existing = await findOrderEntry(orderId);
  if (existing) return { existing: true, rowNumber: existing.rowNumber, notificationStatus: existing.record.notificationStatus };
  const { spreadsheetId, tab } = settings();
  const result = await client().spreadsheets.values.append({ spreadsheetId, range: `'${tab.replaceAll("'", "''")}'!A:Q`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: [[orderId, dateTime, order.name, order.phone, order.email, order.location, order.productName, order.productSlug, order.quantity, order.pricePerPiece, order.pricePerPiece * order.quantity, order.deliveryFee, order.totalPrice, "Cash on Delivery", "Order received", order.clientRequestId, "Pending"]] } });
  const rowNumber = Number((result.data.updates?.updatedRange || "").match(/![A-Z]+(\d+):/)?.[1]) || null;
  return { existing: false, rowNumber, notificationStatus: "Pending" };
}

export async function updateNotificationStatus(rowNumber: number | null, status: string) {
  if (!rowNumber) return;
  const { spreadsheetId, tab } = settings();
  await client().spreadsheets.values.update({ spreadsheetId, range: `'${tab.replaceAll("'", "''")}'!Q${rowNumber}`, valueInputOption: "RAW", requestBody: { values: [[status]] } });
}
