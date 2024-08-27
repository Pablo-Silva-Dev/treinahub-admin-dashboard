import toast from "react-hot-toast";

const showAlertError = (msg: string) =>
  toast.error(msg, {
    style: {
      fontSize: "13px",
    },
     id: "error",
  });

const showAlertSuccess = (msg: string) =>
  toast.success(msg, {
    style: {
      fontSize: "13px",
    },
     id: "success",
  });

const showAlertLoading = (msg: string) =>
  toast.loading(msg, {
    style: {
      fontSize: "13px",
    },
    id: "loading",
  });

export { showAlertError, showAlertLoading, showAlertSuccess };
