const { ipcRenderer } = require('electron');

$(() => {

    $('#btn').click(() => {
        ipcRenderer.send('action:decrypt', $('#private-key').val());
    });

    ipcRenderer.on('alert', (e, data) => {
        alert(data);
    });

    ipcRenderer.on('show-passwords', (e, data) => {
        data.passwords.forEach(element => {
            let index = 0;
            $("tbody").append(`
                <tr class="row${index}">
                    <td>
                        ${element.domain || element.title}
                    </td>
                    <td>
                        ${element.login}
                    </td>
                    <td>
                        ${element.password}
                    </td>
                </tr>`
            );
            $(".row"+index).append(`
                <td>
                    <button class="btn${index}">
                        <img src="./assets/edit-regular.svg">
                    </button>
                    <button class="btn${index}">
                        <img src="./assets/trash-alt-solid.svg">
                    </button>
                </td>
            `);
            $(".btn" + index).hide();
            $(".row"+index).hover(() => {
                $(".btn"+index).show();
            }, () => {
                $(".btn"+index).hide();
            });
        });
    });
});