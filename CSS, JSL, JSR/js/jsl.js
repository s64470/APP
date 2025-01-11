class ViewController {
    constructor() {
    }

    initialiseView() {
        /* Auslesen des Imagebutton List/Kachel Icon */
        this.tilesSwitch = document.getElementsByClassName("imgbutton-thumbnail") [0];

        /* Auslesen des Imagebutton List/Kachel Icon */
        // this.tilesSwitch = document.querySelector("header .imgbutton-thumbnail");

        this.mainView = document.querySelector("main");
        this.fadedSwitch = document.getElementsByClassName("imgbutton-refesh") [0];

        /* Alternativer Abruf als Klassenselektor */
        // this.fadedSwitch = document.querySelector(".imgbutton-refesh");

        /* Auslesen des Imagebutton Plus Icon */
        this.addNewElementAction = document.querySelector("header .imgbutton-add");

        /* Beim Laden der APP Darstellung der Listenansicht zuerst */
        this.mainView.setAttribute("class", "");

        // Toggle: Kachelansicht/Listenansicht
        this.tilesSwitch.onclick = () => {
            // Switch faded
            this.mainView.classList.toggle("faded");
            this.fadedSwitch.classList.toggle("imgbutton-thumbnail");

            const onTransitionend = () => {
                this.mainView.removeEventListener("transitionend", onTransitionend);
                this.mainView.classList.toggle("faded");
                this.mainView.classList.toggle("tiles");

                /* Toggle Kachel/List Icon */
                if (document.getElementsByClassName("imgbutton-thumbnail")[0]) {
                    document.getElementsByClassName("imgbutton-thumbnail")[0]
                        .classList.remove("imgbutton-thumbnail");
                    document.getElementsByClassName("imgbutton")[2]
                        .classList.add("imgbutton-thumbnail1");
                } else if (document.getElementsByClassName("imgbutton-thumbnail1")[0]) {
                    document.getElementsByClassName("imgbutton-thumbnail1")[0]
                        .classList.remove("imgbutton-thumbnail1");
                    document.getElementsByClassName("imgbutton")[2]
                        .classList.add("imgbutton-thumbnail");
                }
            }
            this.mainView.addEventListener("transitionend", onTransitionend);
        }

        // Switch faded => refresh Button
        this.fadedSwitch.onclick = () => {
            this.mainView.classList.toggle("faded");

            const onTransitionend = () => {
                this.mainView.removeEventListener("transitionend", onTransitionend);
                this.mainView.classList.toggle("faded");

                // entirely remove all <li> elements of the dom structure
                this.removeMainViewListObjects();
            }
            this.mainView.addEventListener("transitionend", onTransitionend);
        }
        // interact with list elements
        this.prepareListInteraction();

        // add new elements onclick () -> (Plus Icon)
        this.addNewElementAction.onclick = () => {
            // load data from server
            this.loadDataFromServerAndCreateListView();

            //  const newItem = {
            //      title: [ "sed", "adispicing", "consectetur" ],
            //      owner: [ "placeimg.com" ],
            //      added: ["15.01.2019", "29.01.2019", "06.02.2019"],
            //      numOfTags: [ 9, 0, 2 ],
            //      src: [
            //          "https://placeimg.com/100/100/city",
            //          "https://placeimg.com/200/150/music",
            //          "https://placeimg.com/150/200/culture"
            //      ]
            // }
            // this.addNewElementToList(newItem);
        }
    }

    // entirely remove all <li> elements of the dom structure
    // removeMainViewListObjects() entfernt li Elemente von oben herab
    removeMainViewListObjects() {
        // this.liTemplate = document.querySelector("main ul li");
        this.liTemplate = document.querySelector("main ul");

        // as long as li elements do exist, repeat to remove them
        while (this.liTemplate.firstChild) {
            this.liTemplate.removeChild(this.liTemplate.firstChild);
        }
        // request data from server and refresh main view
        this.loadDataFromServerAndCreateListView();
    }

    // request content from xhr.js
    loadDataFromServerAndCreateListView() {
        xhr("GET", "./data/listitems.json", null, (xhrobj) => {
            const objectlist = JSON.parse(xhrobj.responseText);
            objectlist.forEach(obj => this.addNewElementToList(obj));
        });
    }

    // Aufbau der
    // <main>
    //  <ul>
    //      <li> ... </li>
    //  </ul>
    // </main>
    // HTML Struktur
    addNewElementToList(obj) {
        // dom api with create and appendChild
        const li = document.createElement("li");
        const img = document.createElement("img");
        li.appendChild(img);
        img.classList.add("align-left");
        img.src = obj.src;

        // First DIV element (grid-container)
        const gridContainer = document.createElement("div");
        li.appendChild(gridContainer);
        gridContainer.classList.add("grid-container");

        // First inner DIV element (gridHeader)
        // Web-Link
        const gridHeader = document.createElement("div");
        gridContainer.appendChild(gridHeader);
        gridHeader.classList.add("gridHeader");
        gridHeader.textContent = obj.owner;

        // Second inner DIV element (gridDateTime)
        // Date
        const gridDateTime = document.createElement("div");
        gridContainer.appendChild(gridDateTime);
        gridDateTime.classList.add("gridDateTime");
        // gridDateTime.textContent = obj.added[0];
        // Setting current added Date
        // let today = new Date();
        // let day = String(today.getDate()).padStart(2, '0');
        // let month = String(today.getMonth() + 1).padStart(2, '0');
        // let year = today.getFullYear();
        // today = day + '.' + month + '.' + year;
        // Write current Date
        // gridDateTime.textContent = today;
        gridDateTime.textContent = (new Date()).toLocaleDateString();

        // Third inner DIV element (gridMainTitle)
        // Image title
        const gridMainTitle = document.createElement("div");
        gridContainer.appendChild(gridMainTitle);
        gridMainTitle.classList.add("gridMainTitle");
        gridMainTitle.textContent = obj.title;

        // Fourth inner DIV element (gridPlayBtn)
        // Play Button
        const gridPlayBtn = document.createElement("div");
        gridContainer.appendChild(gridPlayBtn);
        gridPlayBtn.classList.add("gridPlayBtn");

        const buttonPlay = document.createElement("button");
        gridPlayBtn.appendChild(buttonPlay);
        buttonPlay.setAttribute("class", "align-left imgbutton imgbtn-tag");

        // Fifth inner DIV element (gridTagNumber)
        // Tag number
        const gridTagNumber = document.createElement("div");
        gridContainer.appendChild(gridTagNumber);
        gridTagNumber.classList.add("gridTagNumber");
        gridTagNumber.textContent = obj.numOfTags;

        // Sixth inner DIV element (gridDotsBtn)
        // 3-dotted Button
        const gridDotsBtn = document.createElement("div");
        gridContainer.appendChild(gridDotsBtn);
        gridDotsBtn.classList.add("gridDotsBtn");

        const buttonOpt = document.createElement("button");
        gridDotsBtn.appendChild(buttonOpt);
        buttonOpt.setAttribute("class", "align-right imgbutton imgbutton-dots");

        this.listRoot.appendChild(li);
    }

    // Click/Tap Ereignis mit Popup des Titels
    prepareListInteraction() {
        // const liElements = this.mainView.getElementsByTagName("li");
        // for (let i = 0; i < liElements.length; i++) {
        //     let currentLi = liElements[i];
        //     currentLi.onclick = () => {
        //         alert("click on: " + this.getTitleFromLi(currentLi));
        //     }
        // }

        this.listRoot = this.mainView.querySelector("ul");
        this.listRoot.onclick = (evt) => {
            const selectedLi = this.find(evt.target);

            if (selectedLi) {
                if (evt.target.classList.contains("imgbutton-dots")) {

                    // Ausgabe des Titels und der URL bei Selektierung des 3-Punkte Buttons
                    // Ausgabe: Titel & Bild URL in einem alert() Dialog
                    /*alert("Title: " + this.getTitleFromLi(selectedLi) + ", referenced URL: "
                        + document.querySelector(".gridHeader").textContent);*/

                    // Ausgabe: Titel & Bild URL in einem confirm() Dialog, if(true) element entfernen
                    const value = confirm("Entfernen des Elements Title: " + this.getTitleFromLi(selectedLi)
                        + ", referenced URL: " + document.querySelector(".gridHeader").textContent
                        + " aus der Liste.");

                    // if value:boolean equals true, remove selected list item
                    if (value == true) {
                        selectedLi.remove();
                        console.log(selectedLi);
                    } else if (value == false) {
                        return null;
                    }
                } else {
                    // Ausgabe des Titels bei Selektierung des <DIV>-Elements
                    alert("Title: " + this.getTitleFromLi(selectedLi));
                }
            } else {
                alert("something went completely wrong...");
            }
        }
    }

    find(el) {
        if (el.tagName == "LI") {
            return el;
        } else if (el.tagName == "UL") {
            return null;
        } else if (el.parentNode) {
            return this.find(el.parentNode);
        } else {
            return null;
        }
    }

    getTitleFromLi(liElement) {
        // Von der CLASS: gridMainTitle innerhalb der <li>-Elemente
        // den Wert auslesen
        return liElement
            .getElementsByClassName("gridMainTitle") [0]
            .textContent;
    }
}

const instance = new ViewController();
window.onload = () => {
    instance.initialiseView();
}