import Swal from 'sweetalert2';

const alertEx = function (message: string, callback: () => void) {
    Swal.fire({
        text: message,
        allowOutsideClick: false,
    }).then(function () {
        if (callback) { callback(); }
    });
};

const confirmEx = function (message: string, callback: () => void, fallback: () => void) {
    Swal.fire({
        text: message,
        showCancelButton: true,
        allowOutsideClick: false,
    }).then(function (result) {
        if (result.isConfirmed) {
            if (callback) { callback(); }
        } else if (result.isDismissed) {
            if (fallback) { fallback(); }
        }
    });
};

export { alertEx, confirmEx };