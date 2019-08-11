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
            $("tbody").append(`
                <tr>
                    <td>
                        ${element.domain || element.title}
                    </td>
                    <td>
                        ${element.login}
                    </td>
                    <td>
                        ${element.password}
                    </td>
                    <td>
                        <button class="btn">
                            <img src="./trash-alt-solid.svg">
                        </button>
                    </td>
                </tr>
            `)
        });
    })
});