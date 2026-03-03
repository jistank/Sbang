//THIS SCRIPT ALLOWS TO ADD, REMOVE AND READ BANGS

let list = document.getElementById("list");
let inputName = document.getElementById("name");
let inputShortcut = document.getElementById("shortcut");
let inputUrl = document.getElementById("url");
let addBottm = document.getElementById("add");

async function readBangs() {
  let data = await browser.storage.local.get("bangs");
  if (data.bangs) {
    return data.bangs
  } else {
    return [] // If there aren' t bangs it return an empty list
  }
}

async function saveBangsInTheStorage(bangsList) {
  await browser.storage.local.set({ bangs: bangsList }); // setting the name of the list that contains the bangs
}

function createCell(text) {
  let cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

// clear the table and fills it with bangs passed as parameter
function showBangList(bangList) {
  list.innerHTML = "";

  for (let i = 0; i < bangList.length; i++) {
    let bangRecord = bangList[i];

    let row = document.createElement("tr"); // create a row of 3 cells of text
    row.append(createCell(bangRecord.name), createCell(bangRecord.shortcut), createCell(bangRecord.url));

    // create cell with icon to delete a record
    let deleteCell = document.createElement("td");
    let icon = document.createElement("img");
    icon.src = "./trash.svg";
    icon.width = 16;
    icon.height = 16;
    icon.className = "del";
    icon.addEventListener("click", function() {
      deleteBang(i);
    });

    deleteCell.appendChild(icon);
    row.appendChild(deleteCell);
    list.appendChild(row);
  }
}

// load bangs from the storage and show them in the table
async function loadAndShow() {
  let bangList = await readBangs();
  showBangList(bangList);
}

async function deleteBang(position) {
  let bangList = await readBangs();
  bangList.splice(position, 1);
  await saveBangsInTheStorage(bangList);
  loadAndShow();
}

// adding a new bang after clicking add
addBottm.addEventListener("click", async function() {
  let name = inputName.value.trim();
  let shortcut = inputShortcut.value.trim().toLowerCase();
  let url = inputUrl.value.trim();

  if (!name || !shortcut || !url) {
    return;
  } else {
    let bangList = await readBangs();
    bangList.push({ name: name, shortcut: shortcut, url: url });
    await saveBangsInTheStorage(bangList);
  }

  //clear input fields
  inputName.value = "";
  inputShortcut.value = "";
  inputUrl.value = "";

  loadAndShow();
});

loadAndShow();
