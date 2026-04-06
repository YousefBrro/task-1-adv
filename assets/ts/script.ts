class Book{
    #title: string;
    #author: string;
    #category : string;
    #isAvailable: boolean;

    constructor(title:string, author:string, category:string){
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = true;
    }

    getTitle():string {
        return this.#title;
    }

    getAuthor():string {
        return this.#author;
    }

    getCategory():string {
        return this.#category;
    }

    getIsAvailable():boolean {
        return this.#isAvailable;
    }

    setTitle(title: string): void {
        this.#title = title; 
    }

    setAuthor(author: string): void {
        this.#author = author;
    }

    setCategory(category: string): void {
        this.#category = category;
    }

    setAvailable(status: boolean): void {
        this.#isAvailable = status;
    }

    displayInfo() : string {
        return `المؤلف : ${this.#category} | الفئة : ${this.#author}`;
    }
}

class RefranceBook extends Book {
    #locationCode: string;

    constructor(title:string, author:string, category:string,locationCode:string){
        super(title,author,category);
        this.#locationCode = locationCode;
    }

    getLocationCode(){
        return this.#locationCode;
    }

    override displayInfo(): string {
        return `${super.displayInfo()} | موقع الرف : ${this.#locationCode}`
    }
}

class Library {
    #book : Book[] = [];

    addBook(book:Book) : void {
        this.#book.push(book);
    }

    removeBook(title:string) : void {
        this.#book = this.#book.filter(b => b.getTitle() !== title);
    }

    searchBook(query:string):Book[] {
        return this.#book.filter(b => b.getTitle().toLowerCase().includes(query.toLowerCase()) || b.getAuthor().toLowerCase().includes(query.toLowerCase())); 
    }

    toggleAvailability(title: string): void {
        const book = this.#book.find(b => b.getTitle() === title);
        if (book) {
            book.setAvailable(!book.getIsAvailable());
        }
    }

    filterByCategory(category:string) : Book[] {
        if(category === "All") return this.#book;
        return this.#book.filter(b => b.getCategory().toLowerCase() === category.toLowerCase());
    }

    getAllBooks() : Book[] {
        return [...this.#book];
        }
    }


const myLibrary = new Library();

myLibrary.addBook(new Book("عادات ذرية" ,"تطوير ذات","جيمس كلير"));
myLibrary.addBook(new Book("سيكولوجية المال", "اقتصاد","مورغان هاوسل" ));
myLibrary.addBook(new Book("فن اللامبالاة" , "تطوير ذات","مارك مانسون"));
myLibrary.addBook(new Book("فكر وازدد ثراءً",  "علوم","نابليون هيل"));

const bookGrid :HTMLElement = document.getElementById('bookGrid')!;
const bookForm : HTMLElement = document.getElementById('bookModal')!;
const searchInput : HTMLElement = document.getElementById('searchInput')!;
const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;

function render(books: Book[]) {
    bookGrid.innerHTML = "";
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML += 
            `<div class="badge ${book.getIsAvailable()? 'available' : 'unavailable'}">
                ${book.getIsAvailable() ? 'متاح' : 'غير متاح'}
            </div>
            <h3>${book.getTitle()}</h3>
            <div class="location-tag">${book.displayInfo()}</div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="handleToggle('${book.getTitle()}')">تغيير الحالة</button>
                <button class="btn btn-outline-danger" onclick="handleDelete('${book.getTitle()}')">حذف</button>
            </div>`
        ;
        bookGrid.appendChild(card);
    });
}

(window as any).handleDelete = (title: string) => {
    myLibrary.removeBook(title);
    render(myLibrary.getAllBooks());
};

(window as any).handleToggle = (title: string) => {
    const book = myLibrary.getAllBooks().find(b => b.getTitle() === title);
    if (book) {
        book.toggleAvailability();
        render(myLibrary.getAllBooks());
    }
};

searchInput.oninput = (e: any): void => {
    render(myLibrary.searchBook(e.target.value));
};

categoryFilter.onchange = (e: any): void => {
    render(myLibrary.filterByCategory(e.target.value));
};

const form = document.getElementById('openModalBtn') as HTMLButtonElement;
const save = document.getElementById('save') as HTMLButtonElement;
const cancle = document.getElementById('closeModalBtn') as HTMLButtonElement;

const newTitle = document.getElementById('title') as HTMLInputElement;
const newAuthor = document.getElementById('author') as HTMLInputElement;
const newCategory = document.getElementById('category') as HTMLSelectElement;

form.onclick = () => {
    bookForm.style.display = "block";
    bookGrid.style.display = "none";
};

cancle.onclick = () => {
    bookForm.style.display = "none";
    bookGrid.style.display = "block";
};

save.onclick = (e: Event) => {
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
