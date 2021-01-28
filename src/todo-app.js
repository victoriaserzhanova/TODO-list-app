(function () {
  function createTodoApp(container, userName) {
    const title = `${userName}'s TODO list`;
    const storageKeys = {
      Vika: "vikaStorageData",
      dad: "dadStorageData",
      mom: "momStorageData",
    };
    const currentStorageKey = storageKeys[userName];

    let appTitleEl = createTitle(title);
    let itemFormEl= createItemForm();
    let todoListEl = createTodoList();
    let itemsData = [];

    container.append(appTitleEl);
    container.append(itemFormEl.formEl);
    container.append(todoListEl);

    itemFormEl.formBtnEl.setAttribute("disabled", "");

    addTodoListFromLS(todoListEl, currentStorageKey, itemsData);

    // set attribute disabled for formBtnEl if formInputEl is empty
    itemFormEl.formInputEl.addEventListener("input", function () {
      if (itemFormEl.formInputEl.value) {
        itemFormEl.formBtnEl.removeAttribute("disabled");
      } else {
        itemFormEl.formBtnEl.setAttribute("disabled", "");
      }
    });

    // formElsubmit event creates new item
    itemFormEl.formEl.addEventListener("submit", function (event) {
      // prevent default behaviour like page reloading after formElsubmit
      event.preventDefault();

      // NO formElsubmitting if input value is null
      if (!itemFormEl.formInputEl.value) {
        return false;
      }

      // create and add new list-item to todo list. list-item name == input
      let listItemData = {
        name: itemFormEl.formInputEl.value,
        done: false,
      };

      let listItem = createItem(listItemData, itemsData, currentStorageKey);
      todoListEl.append(listItem.itemEl);

      addItemInLS(listItemData, itemsData, currentStorageKey);

      // clean input
      itemFormEl.formInputEl.value = "";

      itemFormEl.formBtnEl.setAttribute("disabled", "");
      return listItem;
    });
  };

  // create and return app title
  function createTitle(title) {
    let titleEl = document.createElement("h2");
    titleEl.textContent = title;
    return titleEl;
  }

  // create and return OBJECT containing formEl, input and btn
  function createItemForm() {
    let formInputEl = document.createElement("input");
    let formEl= document.createElement("form");
    let formBtnEl = document.createElement("button");
    let formBtnWrapperEl = document.createElement("div");

    formEl.classList.add("input-group", "mb-3");
    formInputEl.classList.add("form-control");
    formInputEl.placeholder = "Enter new task";
    formBtnWrapperEl.classList.add("input-group-append");
    formBtnEl.classList.add("btn", "btn-primary");
    formBtnEl.textContent = "Add task";

    formBtnWrapperEl.append(formBtnEl);
    formEl.append(formInputEl);
    formEl.append(formBtnWrapperEl);

    return {
      formEl,
      formInputEl,
      formBtnEl,
    };
  }

  // create and return todo LIST
  function createTodoList() {
    let listEl = document.createElement("ul");
    listEl.classList.add("list-group");
    return listEl;
  }

  // create and return OBJECT, containing list-item, delete and done btns
  function createItem(object, itemsData, currentStorageKey) {
    let itemEl = document.createElement("li");
    // create button group, containing done and delete btns
    let btnGroupEl = document.createElement("div");
    let doneBtnEl = document.createElement("button");
    let delBtnEl = document.createElement("button");

    // set Bootstrap classes for list-item and btns
    itemEl.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    btnGroupEl.classList.add("btn-group", "btn-group-sm");
    doneBtnEl.classList.add("btn", "btn-success");
    delBtnEl.classList.add("btn", "btn-danger");

    itemEl.textContent = object.name;
    doneBtnEl.textContent = "Done";
    delBtnEl.textContent = "Delete";

    // add btns to one block
    btnGroupEl.append(doneBtnEl);
    btnGroupEl.append(delBtnEl);
    itemEl.append(btnGroupEl);

    if (object.done == true) {
      itemEl.classList.add("list-group-item-success");
    }

    doneBtnEl.addEventListener("click", function() {
      itemEl.classList.toggle("list-group-item-success");

      changeItemPropertyInLs(object,itemsData, currentStorageKey);
      });

    delBtnEl.addEventListener("click", function() {
      if (confirm('Delete task')) {
        itemEl.remove();
        deleteItemFromLs(object,itemsData, currentStorageKey);
        console.log(localStorage)
      };
      console.log(localStorage)
    });

    // app needs access to item and btns
    return {
      itemEl,
      doneBtnEl,
      delBtnEl,
    };
  }

  function addItemInLS(object,arrayOfObjects, currentStorageKey) {
      if (getItemsFromLs(currentStorageKey)){
        arrayOfObjects = getItemsFromLs(currentStorageKey);
      }
      if (countItemsInLs(currentStorageKey)) {
        object.id = countItemsInLs(currentStorageKey);
      }else{
        object.id = 0;
      }
      arrayOfObjects.push(object);
      localStorage.setItem(
        currentStorageKey,
        JSON.stringify(arrayOfObjects)
      );
    }

  function changeItemPropertyInLs(object,arrayOfObjects, currentStorageKey) {
      arrayOfObjects = getItemsFromLs(currentStorageKey);
      let itemToChangeId = object.id;
      let itemToChange = arrayOfObjects.find(item => item.id == itemToChangeId);
      if (itemToChange.done == true) {
        itemToChange.done = false;
      }else {
        itemToChange.done = true;
      }
      console.log(arrayOfObjects)
      localStorage.setItem(
        currentStorageKey,
        JSON.stringify(arrayOfObjects)
      );
      console.log(localStorage)
  }

  function deleteItemFromLs(object,arrayOfObjects, currentStorageKey) {
    arrayOfObjects = getItemsFromLs(currentStorageKey);
    let itemId = object.id;
    for (let i=0; i<arrayOfObjects.length; i++) {
      let indexOfItemToChange = i;
      if (arrayOfObjects[i].id == itemId) {
        arrayOfObjects.splice(indexOfItemToChange,1);
        localStorage.setItem(
          currentStorageKey,
          JSON.stringify(arrayOfObjects)
        );
      }
    }
  }

  function getItemsFromLs(currentStorageKey) {
      if (localStorage.getItem(currentStorageKey)) {
          let items = JSON.parse(localStorage.getItem(currentStorageKey));
          return items;
      } else {
          return false;
      }
  }

  function countItemsInLs(currentStorageKey) {
      if (getItemsFromLs(currentStorageKey)) {
          return getItemsFromLs(currentStorageKey).length;
      } else {
          return false;
      }
  }

  function addTodoListFromLS(todoListEl, currentStorageKey, itemsData) {
    if (getItemsFromLs(currentStorageKey)) {
      let storageTodoList = getItemsFromLs(currentStorageKey);
      storageTodoList.forEach(function (element) {
        let listItemFromLS = createItem(element, itemsData,currentStorageKey);
        todoListEl.append(listItemFromLS.itemEl);
      });
    }else {
      return false;
    }
  }

  window.createTodoApp = createTodoApp;
})();
