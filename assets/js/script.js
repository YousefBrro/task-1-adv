"use strict";
class Book {
    #title;
    #author;
    #category;
    #isAvailable;
    constructor(title, author, category) {
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = true;
    }
    getTitle() {
        return this.#title;
    }
    getAuthor() {
        return this.#author;
    }
    getCategory() {
        return this.#category;
    }
    getIsAvailable() {
        return this.#isAvailable;
    }
    setTitle(title) {
        this.#title = title;
    }
    setAuthor(author) {
        this.#author = author;
    }
    setCategory(category) {
        this.#category = category;
    }
    setAvailable(status) {
        this.#isAvailable = status;
    }
    displayInfo() {
        return `المؤلف : ${this.#category} | الفئة : ${this.#author}`;
    }
}
class RefranceBook extends Book {
    #locationCode;
    constructor(title, author, category, locationCode) {
        super(title, author, category);
        this.#locationCode = locationCode;
    }
    getLocationCode() {
        return this.#locationCode;
    }
    displayInfo() {
        return `${super.displayInfo()} | موقع الرف : ${this.#locationCode}`;
    }
}
class Library {
    #book = [];
    addBook(book) {
        this.#book.push(book);
    }
    removeBook(title) {
        this.#book = this.#book.filter(b => b.getTitle() !== title);
    }
    searchBook(query) {
        return this.#book.filter(b => b.getTitle().toLowerCase().includes(query.toLowerCase()) || b.getAuthor().toLowerCase().includes(query.toLowerCase()));
    }
    toggleAvailability(title) {
        const book = this.#book.find(b => b.getTitle() === title);
        if (book) {
            book.setAvailable(!book.getIsAvailable());
        }
    }
    filterByCategory(category) {
        if (category === "All")
            return this.#book;
        return this.#book.filter(b => b.getCategory().toLowerCase() === category.toLowerCase());
    }
    getAllBooks() {
        return [...this.#book];
    }
}
const myLibrary = new Library();
myLibrary.addBook(new Book("عادات ذرية", "تطوير ذات", "جيمس كلير"));
myLibrary.addBook(new Book("سيكولوجية المال", "اقتصاد", "مورغان هاوسل"));
myLibrary.addBook(new Book("فن اللامبالاة", "تطوير ذات", "مارك مانسون"));
myLibrary.addBook(new Book("فكر وازدد ثراءً", "علوم", "نابليون هيل"));
const bookGrid = document.getElementById('bookGrid');
const bookForm = document.getElementById('bookModal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
function render(books) {
    bookGrid.innerHTML = "";
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML +=
            `<div class="badge ${book.getIsAvailable() ? 'available' : 'unavailable'}">
                ${book.getIsAvailable() ? 'متاح' : 'غير متاح'}
            </div>
            <h3>${book.getTitle()}</h3>
            <div class="location-tag">${book.displayInfo()}</div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="handleToggle('${book.getTitle()}')">تغيير الحالة</button>
                <button class="btn btn-outline-danger" onclick="handleDelete('${book.getTitle()}')">حذف</button>
            </div>`;
        bookGrid.appendChild(card);
    });
}
window.handleDelete = (title) => {
    myLibrary.removeBook(title);
    render(myLibrary.getAllBooks());
};
window.handleToggle = (title) => {
    const book = myLibrary.getAllBooks().find(b => b.getTitle() === title);
    if (book) {
        book.toggleAvailability();
        render(myLibrary.getAllBooks());
    }
};
searchInput.oninput = (e) => {
    render(myLibrary.searchBook(e.target.value));
};
categoryFilter.onchange = (e) => {
    render(myLibrary.filterByCategory(e.target.value));
};
const form = document.getElementById('openModalBtn');
const save = document.getElementById('save');
const cancle = document.getElementById('closeModalBtn');
const newTitle = document.getElementById('title');
const newAuthor = document.getElementById('author');
const newCategory = document.getElementById('category');
form.onclick = () => {
    bookForm.style.display = "block";
    bookGrid.style.display = "none";
};
cancle.onclick = () => {
    bookForm.style.display = "none";
    bookGrid.style.display = "block";
};
save.onclick = (e) => {
    e.preventDefault();
    const title = newTitle.value;
    const author = newAuthor.value;
    const category = newCategory.value;
    myLibrary.addBook(new Book(title, author, category));
    render(myLibrary.getAllBooks());
    newTitle.value = "";
    newAuthor.value = "";
    bookForm.style.display = "none";
    bookGrid.style.display = "block";
};
render(myLibrary.getAllBooks());
