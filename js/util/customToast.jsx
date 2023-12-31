import {toast} from "react-toastify";

export const customToast = {
    success(msg, options = {}) {
        return toast.success(msg, {
            ...options,
            className: 'toast-success-container',
            progressStyle: {backgroundColor: "#29B6F699"},
        });
    },
    error(msg, options = {}) {
        return toast.error(msg, {
            ...options,
            className: 'toast-success-container',
            progressStyle: {backgroundColor: "#f6292999"},
        });
    },
    info(msg, options = {}) {
        return toast.info(msg, {

            ...options,
            className: 'toast-success-container',
            bodyStyle: {backgroundColor: "black"},
            progressStyle: {backgroundColor: "#29B6F699"},
        });

    },
};

