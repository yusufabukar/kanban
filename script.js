const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

let updatedOnLoad = false;

let backlogListArray = new Array();
let progressListArray = new Array();
let completeListArray = new Array();
let onHoldListArray = new Array();
let listArrays = new Array();

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
	if (localStorage.getItem('backlogItems')) {
		backlogListArray = JSON.parse(localStorage.getItem('backlogItems'));
		progressListArray = JSON.parse(localStorage.getItem('progressItems'));
		completeListArray = JSON.parse(localStorage.getItem('completeItems'));
		onHoldListArray = JSON.parse(localStorage.getItem('onHoldItems'));
	} else {
		backlogListArray = ['Go to the gym', 'Sit back and relax'];
		progressListArray = ['Work on my dreams', 'Be better than yesterday'];
		completeListArray = ['Being cool', 'Getting stuff done'];
		onHoldListArray = ['Not being cool'];
	};
};

function updateSavedColumns() {
	listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
	const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

	arrayNames.forEach((arrayName, i) => {
		localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
	});
};

function filterArray(array) {
	const filteredArray = array.filter(item => item != null);

	return filteredArray;
};

function createItemElement(columnElement, column, item, i) {
	const listElement = document.createElement('li');
	listElement.classList.add('drag-item');
	listElement.textContent = item;
	listElement.draggable = true;
	listElement.setAttribute('ondragstart', 'drag(event)');
	listElement.contentEditable = true;
	listElement.id = i;
	listElement.setAttribute('onfocusout', `updateItem(${i}, ${column})`);

	columnElement.appendChild(listElement);
};

function updateDOM() {
	if (!updatedOnLoad) {
		getSavedColumns();
	};

	backlogList.textContent = '';
	backlogListArray.forEach((backLogItem, i) => createItemElement(backlogList, 0, backLogItem, i));
	backlogListArray = filterArray(backlogListArray);

	progressList.textContent = '';
	progressListArray.forEach((progressItem, i) => createItemElement(progressList, 1, progressItem, i));
	progressListArray = filterArray(progressListArray);

	completeList.textContent = '';
	completeListArray.forEach((completeItem, i) => createItemElement(completeList, 2, completeItem, i));
	completeListArray = filterArray(completeListArray);

	onHoldList.textContent = '';
	onHoldListArray.forEach((onHoldItem, i) => createItemElement(onHoldList, 3, onHoldItem, i));
	onHoldListArray = filterArray(onHoldListArray);

	updatedOnLoad = true;
	updateSavedColumns();
};

function updateItem(id, column) {
	const selectedArray = listArrays[column];
	const selectedColumnElement = listColumns[column].children;

	if (!dragging) {
		if (!selectedColumnElement[id].textContent) {
			delete selectedArray[id];
		} else {
			selectedArray[id] = selectedColumnElement[id].textContent;
		};
	
		updateDOM();
	};
};

function addToColumn(column) {
	const itemText = addItems[column].textContent;
	const selectedArray = listArrays[column];
	selectedArray.push(itemText);
	addItems[column].textContent = '';
	updateDOM();
};

function showInputBox(column) {
	addBtns[column].style.visibility = 'hidden';
	saveItemBtns[column].style.display = 'flex';
	addItemContainers[column].style.display = 'flex';
};

function hideInputBox(column) {
	addBtns[column].style.visibility = 'visible';
	saveItemBtns[column].style.display = 'none';
	addItemContainers[column].style.display = 'none';
	addToColumn(column);
};

function rebuildArrays() {
	backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
	progressListArray = Array.from(progressList.children).map(item => item.textContent);
	completeListArray = Array.from(completeList.children).map(item => item.textContent);
	onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);

	updateDOM();
};

function drag(e) {
	draggedItem = e.target;
	dragging = true;
};

function dragEnter(column) {
	listColumns[column].classList.add('over');
	currentColumn = column;
};

function allowDrop(e) {
	e.preventDefault();
};

function drop(e) {
	e.preventDefault();

	listColumns.forEach(column => column.classList.remove('over'));
	const parent = listColumns[currentColumn];
	parent.appendChild(draggedItem);
	dragging = false;
	rebuildArrays();
};

updateDOM();