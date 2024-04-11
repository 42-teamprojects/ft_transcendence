export const toCapital = (str) => {
    return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
};

export const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date).toDateString();
    return `${d.slice(4, 7)} ${d.slice(8, 10)}, ${d.slice(11, 15)}`;
};

export const randColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    const colorWithOpacity = randomColor + "40";

    return colorWithOpacity;
};

export const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0;
};

export function truncate(str, maxlength) {
    return (str.length > maxlength) ?
      str.slice(0, maxlength - 1) + '…' : str;
  }