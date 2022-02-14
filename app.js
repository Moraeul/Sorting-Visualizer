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
  barsArray[indexA].style.height = `${array[indexB]}%`;
  barsArray[indexB].style.height = `${array[indexA]}%`;

  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};

// ++++++++++++++++++++++++++++

// Sorting Algorithms ---------------
// ++++++ BUBBLE SORT ++++++
async function bubbleSort(array) {
  let n = array.length;
  let swapped;
  for (let j = n; j > 0; j--) {
    swapped = false;

    for (let i = 0; i < j; i++) {
      barsArray[i].style.backgroundColor = "var(--accent-color)";
      await sleep(1);
      barsArray[i].style.backgroundColor = "var(--snd-color)";

      if (array[i] > array[i + 1]) {
        swap(array, i, i + 1);
        swapped = true;
      }
    }
    barsArray[j - 1].style.backgroundColor = "red";
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
      await sleep(50);
      barsArray[minIndex].style.backgroundColor = "var(--snd-color)";

      swap(array, i, minIndex);
    }
    barsArray[i].style.backgroundColor = "var(--accent-color)";
  }
  barsArray[n - 1].style.backgroundColor = "var(--accent-color)";
  toggleInputs(false);
}

// ++++++ HEAP SORT ++++++
async function heapSort(array) {
  const n = array.length;

  // find the last parent node that has at least one child
  for (let j = Math.floor(n / 2) - 1; j >= 0; j--) {
    barsArray[j].style.backgroundColor = "green";
    await sleep(50);
    barsArray[j].style.backgroundColor = "var(--snd-color)";

    maxHeapify(array, n, j);
  }

  for (let i = n - 1; i >= 0; i--) {
    await sleep(50);
    barsArray[i].style.backgroundColor = "dodgerblue";

    swap(array, 0, i);
    maxHeapify(array, i, 0);
  }
  toggleInputs(false);
}

async function maxHeapify(array, n, node) {
  let largest = node;
  let l = node * 2 + 1;
  let r = node * 2 + 2;

  // If left child is larger than node
  if (l < n && array[l] > array[largest]) {
    largest = l;
  }

  // If right child is larger than node and left
  if (r < n && array[r] > array[largest]) {
    largest = r;
  }

  // swap if largest is NOT same as node
  if (largest != node) {
    swap(array, node, largest);

    // Recursively maxHeapify sub-tree
    maxHeapify(array, n, largest);
  }
}

// ++++++ QUICK SORT ++++++
const quickSort = (array) => {
  partition(array, 0, array.length - 1);
};
let countPartitions = 0;
async function partition(array, start, end) {
  countPartitions++;
  if (start >= end) {
    if (barsArray[start]) {
      barsArray[start].style.backgroundColor = "gold";
    }
    countPartitions--;
    return;
  }

  let pivot = start;
  let left = start + 1;
  let right = end;

  while (left <= right) {
    barsArray[pivot].style.backgroundColor = "red";
    barsArray[left].style.backgroundColor = "blue";
    barsArray[right].style.backgroundColor = "green";

    await sleep(1);

    if (array[left] > array[pivot] && array[right] < array[pivot]) {
      swap(array, left, right);
    }

    await sleep(1);

    barsArray[left].style.backgroundColor = "var(--snd-color)";
    barsArray[right].style.backgroundColor = "var(--snd-color)";

    if (array[left] <= array[pivot]) {
      left++;
    }

    if (array[right] >= array[pivot]) {
      right--;
    }

    barsArray[pivot].style.backgroundColor = "var(--snd-color)";
  }

  await sleep(1);

  if (pivot !== right) {
    swap(array, pivot, right);
    barsArray[right].style.backgroundColor = "gold";
  }

  partition(array, right + 1, end);
  partition(array, start, right - 1);

  countPartitions--;
  if (countPartitions === 0) {
    toggleInputs(false);
  }
}

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
