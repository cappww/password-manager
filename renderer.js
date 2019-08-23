const { ipcRenderer } = require('electron');

function uniformData(obj) {
    return (`
        <td>
            <span>${obj.domain || obj.title}</span>
        </td>
        <td>
            <span>${obj.login}</span>
        </td>
        <td>
            <span>${obj.password}</span>
        </td>
        <td class="col">

        </td>
    `);
}

$(() => {

    $('#btn').click(() => {
        ipcRenderer.send('action:decrypt', $('#private-key').val());
        $('#btn').remove();
        $('#private-key').remove();
    });

    ipcRenderer.on('alert', (e, data) => {
        alert(data);
    });

    ipcRenderer.on('show-passwords', (e, data) => {
        data.passwords.forEach(element => {
            $("tbody").append(`
                <tr class="row">
                    ${ uniformData(element) }
                </tr>`
            );
        });

        let state = {
            editMode: false
        }

        $('tr').not(':first').hover(function() {
            if($(this).prop("id") === "edit-mode"){
                $(this).css('background', 'yellow');
            } else if(!state.editMode) {
                $(this).css('background', 'yellow');
                $(this).children('.col').append(`
                    <button class="btn" id="copy-btn">
                        <img src="./assets/clipboard-regular.svg">
                    </button>
                    <button class="btn" id="edit-btn">
                        <img src="./assets/edit-regular.svg">
                    </button>
                    <button class="btn" id="delete-btn">
                        <img src="./assets/trash-alt-solid.svg">
                    </button>
                `);
            }
            
            let self = this;
            let index = $(this).index() - 1;
            let passObj = data.passwords[index];

            $('#copy-btn').click(function() {
                ipcRenderer.send('action:copy', passObj.password)
                alert("Password copied to clipboard");
            });
            
            $("#edit-btn").click(function() {
                const name = passObj.domain || passObj.title;
                const login = passObj.login;
                const password = passObj.password;
                $(self).html(`
                    <td>
                        <input value="${name}">
                    </td>
                    <td>
                        <input value="${login}">
                    </td>
                    <td>
                        <input value="${password}">
                    </td>
                    <td class="col">
                        <button>
                            Save
                        </button>
                        <button id="cancel-btn">
                            Cancel
                        </button>
                    </td>
                `);
                $(self).prop("id", "edit-mode");
                state.editMode = true;

                $('#cancel-btn').click(function () {
                    state.editMode = false;
                    $(self).children()
                    $(self).prop("id", "");
                    $(self).children().remove();
                    $(self).append( uniformData(passObj) );
                });
            });

            
        }, function() {
            $(this).css('background', '');
            $(".btn").remove();
        });      
    });
});