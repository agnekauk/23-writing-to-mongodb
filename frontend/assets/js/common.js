const url = 'http://localhost:3005';
const addNewToDo = document.querySelector('#add-new-text');
const messageDiv = document.querySelector('.messages');


const messages = (message, status) => {
    let klase = (status === 'success') ? 'alert-success' : 'alert-danger';
    messageDiv.innerHTML = message;
    messageDiv.classList.remove('alert-success', 'alert-danger');
    messageDiv.classList.add('show', klase);
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 8000)
}

const transferData = async (url, method = 'GET', data = []) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (method != 'GET') {
        options.body = JSON.stringify(data);
    }

    const resp = await fetch(url, options);

    return resp.json()
}

const getData = () => {
    transferData(url)
        .then(resp => {

            html = '<ul>'

            resp.data.forEach(value => {
                html += `<li data-id='${value._id}'>
                <a class='info'><span class='new-content'>${value.content}</span> ${value.data}</a>
                <a class='btn btn-outline-secondary edit'>Edit</a>
                <a class='btn btn-outline-secondary delete'>Delete</a>
                </li>`
            })
            html += '</ul>'

            document.querySelector('#content').innerHTML = html;

            document.querySelectorAll('.edit').forEach(element => {
                let id = element.parentElement.getAttribute('data-id');
                let content = element.parentElement.querySelector('.new-content').innerText;

                element.addEventListener('click', () => {

                    document.querySelector('#new-text').value = content;
                    addNewToDo.textContent = addNewToDo.getAttribute('data-edit-label');
                    addNewToDo.setAttribute('data-mode', 'edit');
                    addNewToDo.setAttribute('element-id', id);
                })
            })

            document.querySelectorAll('.delete').forEach(element => {
                let id = element.parentElement.getAttribute('data-id');

                element.addEventListener('click', () => {
                    transferData(url + '/delete-data/' + id, 'DELETE')
                        .then(resp => {
                            getData();
                            messages("DELETED");
                        })
                })
            })
        })
}

window.addEventListener('load', () => {
    getData();
})

addNewToDo.addEventListener('click', () => {
    let newContent = document.querySelector('#new-text').value;
    let newData = document.querySelector('#new-date').value;
    let mode = addNewToDo.getAttribute('data-mode');

    let route = url + '/save-data';
    let method = 'POST';

    if (content === '') {
        let messages = document.querySelector('.messages');
        messages.innerHTML = 'Add a text and date';
        messages.classList.add('show');
        return
    }

    if (mode == "edit") {

        let id = addNewToDo.getAttribute('element-id');

        route = url + '/edit-data/' + id;
        method = 'PUT';

    }

    transferData(route, method, { content: newContent, data: newData })
        .then(resp => {
            getData();
            document.querySelector('#new-text').value = '';
            addNewToDo.setAttribute('data-mode', 'add');
            addNewToDo.textContent = addNewToDo.getAttribute('data-add-label');
            messages("Information added to database");
        })
})