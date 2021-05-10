class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Store {
    static getBooks() {
        let books;
        const bookList = localStorage.getItem('books');
        if(bookList == null) {
            books = [];
        } else {
            books = JSON.parse(bookList);
        }
        return books;
    }

    static addBook(newBook) {
        const books = Store.getBooks();
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book,index) => {
            if(book.isbn == isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI {
    static displayBooks() {
        const StoredBooks = Store.getBooks();
        const books = StoredBooks;
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    };

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(text, className) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(text));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(alertDiv, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const bookObj = new Book(title, author, isbn);
    if(title && author && isbn) {
        UI.addBookToList(bookObj);
        Store.addBook(bookObj);
        UI.showAlert('Book Added!', 'success');
        UI.clearFields();
    } else {
        UI.showAlert('Please fill in all the details!', 'danger');
    }
});

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book Removed!', 'info');
})