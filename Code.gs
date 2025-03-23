// ระบุเฉพาะโฟลเดอร์ที่ต้องการให้แสดง
const selectedFolderIdArr = [
  "18Ry1hGW2lE0k4pxZiOB-vX1TQHXx8VUo" // 👈 เปลี่ยนเป็น Folder ID จริง
]

// MAIN ENTRY POINT
function doGet(e) {
  const folderData = getSelectedFolders();
  const htmlTmp = HtmlService.createTemplateFromFile("index");
  htmlTmp.folderData = folderData;
  return htmlTmp.evaluate();
}

// ดึงเฉพาะโฟลเดอร์ที่อยู่ใน selectedFolderIdArr
function getSelectedFolders() {
  const folderData = [];

  selectedFolderIdArr.forEach(fdid => {
    try {
      const folder = DriveApp.getFolderById(fdid);
      folderData.push({
        folderName: folder.getName(),
        folderUrl: folder.getUrl(),
        folderId: fdid
      });
    } catch (err) {
      Logger.log(`ไม่พบโฟลเดอร์ ID: ${fdid} - ${err}`);
    }
  });

  return folderData;
}

// ดึงไฟล์ในโฟลเดอร์
function getFilesDataInFolder(fdid) {
  try {
    const folder = DriveApp.getFolderById(fdid);
    const folderData = {
      folderName: folder.getName(),
      folderUrl: folder.getUrl(),
      folderId: fdid
    };

    const files = folder.getFiles();
    const filesArr = [];

    while (files.hasNext()) {
      const file = files.next();

      let mimeType = file.getMimeType();
      if (mimeType.startsWith("application/vnd.google-apps.")) {
        mimeType = mimeType.replace("application/vnd.google-apps.", "");
      } else if (mimeType === "application/pdf") {
        mimeType = "pdf";
      }

      filesArr.push({
        name: file.getName(),
        url: file.getUrl(),
        mimeType: mimeType
      });
    }

    filesArr.sort((a, b) => a.name.localeCompare(b.name));
    return { filesArr, folderData };

  } catch (err) {
    Logger.log(err.toString());
    return err.toString();
  }
}

function include(htmlFileName) {
  return HtmlService.createHtmlOutputFromFile(htmlFileName).getContent();
}
