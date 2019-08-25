const { ipcRenderer } = require('electron');

function displayUniformData(data) {
    data.passwords.forEach(element => {
        $("tbody").append(
            `<tr class="row">
                <td>
                    <span>${element.domain || element.title}</span>
                </td>
                <td>
                    <span>${element.login}</span>
                </td>
                <td>
                    <span>${element.password}</span>
                </td>
                <td class="col">

                </td>
            </tr>`
        );
    });
}

$(() => {

    $('#btn').click(() => {
        ipcRenderer.send('action:decrypt', $('#private-key').val());
    });

    ipcRenderer.on('alert', (e, data) => {
        alert(data);
    });

    ipcRenderer.on('show-passwords', (e, data) => {
        $('#btn').remove();
        $('#private-key').remove();
        displayUniformData(data);

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
                        <button id="save-btn">
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
                    $(self).append( 
                        `<td>
                            <span>${passObj.domain || passObj.title}</span>
                        </td>
                        <td>
                            <span>${passObj.login}</span>
                        </td>
                        <td>
                            <span>${passObj.password}</span>
                        </td>
                        <td class="col">

                        </td>`
                    );
                });

                $('#save-btn').click(function(){
                    let dataArr = $(self).contents().find('input');
                    const name = dataArr[0].value;
                    const login = dataArr[1].value;
                    const password = dataArr[2].value;

                    passObj.domain = name;
                    passObj.login = login;
                    passObj.password = password;
                    ipcRenderer.send("action:save-encrypt", data);
                });
            });

            $('#delete-btn').click(function () {
                if (confirm(`Are you sure you want to delete ${passObj.domain || passObj.title}?`)) {
                    data.passwords.splice(index, 1);
                    ipcRenderer.send("action:save-encrypt", data);
                }
            });

            
        }, function() {
            $(this).css('background', '');
            $(".btn").remove();
        });      
    });
});