"use strict";
const range = document.getElementById("range");
const rangeDisplay = document.getElementById("displayRange");
const barsContainer = document.getElementById("barContainer");
const barsArray = document.getElementsByClassName("bar");
const radioButtonArray = document.getElementsByName("radio");

const sortButton = document.getElementById("sortButton");
const newArray = document.getElementById("newArray");

const displayRange = () => {
  rangeDisplay.innerText = range.value;
};

// random number between 2 int
const randomHeight = (max, min) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// transform bars height into array of numbers
const getArray = () => {
  let array = [];
  for (let i = 0; i < barsArray.length; i++) {
    array.push(parseInt(barsArray[i].style.height));
  }
  return array;
};

let selectedSortingAlgorithm = "selectionSort";
const getCheckedRadio = () => {
  radioButtonArray.forEach((radio) => {
    if (radio.checked) selectedSortingAlgorithm = radio.value;
  });
};

const toggleInputs = (bool) => {
  [range, sortButton, newArray].forEach((input) => input.toggleAttribute("disabled", bool));

  // bool = true  { adds "disabled" attribute to html element }
  // bool = false { removes "disabled" attribute }
};

const changeWidth = () => {
  const width =
    range.value <= 15
      ? 40
      : range.value <= 30
      ? 25
      : range.value <= 60
      ? 15
      : range.value <= 120
      ? 10
      : 8;
  return width;
};

const createBars = () => {
  // creates (range) number of divs with random heights
  barsContainer.innerHTML = "";
  for (let i = 0; i < range.value; i++) {
    barsContainer.innerHTML += `<div class="bar" style="height:${randomHeight(
      5,
      99
    )}%;width:${changeWidth()}px"></div>`;
  }
};
createBars();

// ++++++++++++++++++++++++++++

const sleep = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};

// ++++++++++++++++++++++++++++

// Sorting Algorithms ---------------
// ++++++ BUBBLE SORT ++++++
async function bubbleSort(array) {
  let n = array.length;
  let swapped = true;
  for (let j = n; j > 0; j--) {
    swapped = false;

    for (let i = 0; i < j; i++) {
      barsArray[i].style.backgroundColor = "var(--accent-color)";
      await sleep(1);
      barsArray[i].style.backgroundColor = "var(--snd-color)";

      if (array[i] > array[i + 1]) {
        barsArray[i].style.height = `${array[i + 1]}%`;
        barsArray[i + 1].style.height = `${array[i]}%`;

        swap(array, i, i + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  toggleInputs(false);
}

// ++++++ SELECTION SORT ++++++
async function selectionSort(array) {
  let n = array.length;
  let i, j;

  for (i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex != i) {
      barsArray[minIndex].style.backgroundColor = "brown";
      barsArray[i].style.backgroundColor = "var(--accent-color)";
      await sleep(150);
      barsArray[i].style.backgroundColor = "var(--snd-color)";
      barsArray[minIndex].style.backgroundColor = "var(--snd-color)";

      barsArray[i].style.height = `${array[minIndex]}%`;
      barsArray[minIndex].style.height = `${array[i]}%`;
      swap(array, i, minIndex);
    }
  }
  toggleInputs(false);
}

// ++++++ HEAP SORT ++++++
async function heapSort(array) {
  const n = array.length;

  // find the last parent node that has at least one child
  for (let j = Math.floor(n / 2) - 1; j >= 0; j--) {
    barsArray[j].style.backgroundColor = "green";
    await sleep(10);
    barsArray[j].style.backgroundColor = "var(--snd-color)";

    heapify(array, n, j);
  }

  for (let i = n - 1; i >= 0; i--) {
    barsArray[i].style.backgroundColor = "dodgerblue";
    await sleep(50);
    barsArray[i].style.backgroundColor = "var(--snd-color)";
    barsArray[i].style.height = `${array[0]}%`;
    barsArray[0].style.height = `${array[i]}%`;

    swap(array, 0, i);
    heapify(array, i, 0);
  }
  toggleInputs(false);
}

async function heapify(array, n, root) {
  let largest = root;
  let l = root * 2 + 1;
  let r = root * 2 + 2;

  // If left child is larger than root
  if (l < n && array[l] > array[largest]) {
    largest = l;
  }

  // If right child is larger than root and left
  if (r < n && array[r] > array[largest]) {
    largest = r;
  }

  // swap if largest is NOT same as root
  if (largest != root) {
    barsArray[root].style.height = `${array[largest]}%`;
    barsArray[largest].style.height = `${array[root]}%`;
    swap(array, root, largest);

    // Recursively heapify sub-tree
    heapify(array, n, largest);
  }
}

// ++++++ QUICK SORT ++++++
const quickSort = () => {
  console.log("quick was called");
  toggleInputs(false);
};

// ++++++ SORT ++++++
const sort = (sortingAlgorithm) => {
  toggleInputs(true);
  let array = getArray();

  sortingAlgorithm === "bubbleSort"
    ? bubbleSort(array)
    : sortingAlgorithm === "selectionSort"
    ? selectionSort(array)
    : sortingAlgorithm === "heapSort"
    ? heapSort(array)
    : quickSort(array);
};

// Input Handlers ---------------

range.addEventListener("input", () => {
  displayRange();
  createBars();
});

sortButton.addEventListener("click", () => {
  getCheckedRadio();
  sort(selectedSortingAlgorithm);
});

// make sorted bar another color
// make universal animation function
// make speed input
// add description to each alg at the bottom
