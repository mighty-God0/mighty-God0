const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("upload-btn");

const indexedDB = window.indexedDB;
const dbName = "imageDB";

function createDb(){
    const request = indexedDB.open(dbName, 1);

    request.onerror = (e) => {
        console.log("error:" + e.target.error)
    }

    request.onupgradeneeded = (e) => {
        let db = e.target.result;

        const store = db.createObjectStore("image", {keyPath: "id"})
        store.createIndex("name", "name", {unique: false})

        request.onsuccess = () => {
            db.close()
        }
    }
}

function upDateDb(){
    const request = indexedDB.open(dbName, 1);

    request.onerror = (e) => {
        console.log("error:" + e.target.error)
    }

    request.onsuccess = (e) => {
       let db = e.target.result

       const transaction = db.transaction("image", "readwrite")

       const store = transaction.objectStore("image")

       const getAll = store.getAll()

       getAll.onsuccess = () => {
        renderfiles(getAll.result)
       }

       request.oncomplete = () => {
        db.close()
       }
    }
}

createDb()
upDateDb()

function uniqueId() {
    return "xxxxxxxx-xxxx-4xx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = Math.random()* 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

uploadBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if(file){
        const reader = new FileReader()
        reader.onload = (e) => {
            const fileData = e.target.result;

            fileInput.value = "";

            const request = indexedDB.open(dbName, 1);

            request.onerror = (e) => {
                console.log("error:" + e.target.error)
            }
        
            request.onsuccess = (e) => {
               let db = e.target.result
        
               const transaction = db.transaction("image", "readwrite")
        
               const store = transaction.objectStore("image")
        
               store.put({
                id: uniqueId(),
                name: file.name,
                image: fileData
               })
        
               request.oncomplete = () => {
                db.close()
               }
            }

            upDateDb()

        }

        reader.readAsDataURL(file);
    }
});

function renderfiles(array){
    for(let i = 0; i < array.length; i++){
        const list = document.createElement("li");
        list.textContent = array[i].name
        list.addEventListener('click', () => showImage(array[i].image))
        document.getElementById("fileList").appendChild(list);
    }
}

// function showImage(url) {
//     const modal = document.querySelector(".modal")
//     modal.innerHTML = `<img src="${url}"/>` 
//     modal.style.display = "block"

//     .onclick = (e) => {
//         if(e.target == modal){
//             modal.style.display = "none"
//         }
//     }
// }
