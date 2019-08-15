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
                <tr class="row">
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
        });

        $('tr').not(':first').hover(function() {
            $(this).css('background', 'yellow');
            $(this).append(
                `<td id="col">
                    <button class="btn">
                        <img src="./assets/edit-regular.svg">
                    </button>
                    <button class="btn">
                        <img src="./assets/trash-alt-solid.svg">
                    </button>
                </td>`
            );
        }, function(){
            $(this).css('background', '');
            $("#col").remove();
        })
        
    });
});