import Toast from "../components/comps/toast.js";
import { useFormData } from "./useForm.js";

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
	return str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str;
}

export function isThere(haystack, needle, fallback) {
	if (needle === null) {
		return fallback;
	}

	return haystack.includes(needle.toLowerCase()) ? needle.toLowerCase() : fallback;
}

export function shuffleArray(array) {
	let len = array.length,
		currentIndex;
	for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
		let randIndex = Math.floor(Math.random() * (currentIndex + 1));
		var temp = array[currentIndex];
		array[currentIndex] = array[randIndex];
		array[randIndex] = temp;
	}
}

export function findNeedle(haystack, needle) {
	return haystack.find((item) => item === needle);
}

export function handleInputError(form, fieldName, errorMessage) {
	// Remove existing error message
	const existingErrorSpan = form.querySelector(`span.input-error.${fieldName}`);
	if (existingErrorSpan) {
		existingErrorSpan.remove();
	}

	const inputField = form.querySelector(`input[name='${fieldName}']`);
	inputField.classList.remove("error");

	// Add new error message
	if (errorMessage) {
		inputField.classList.add("error");
		const errorSpan = document.createElement("span");
		errorSpan.classList.add("input-error", fieldName, "text-xs", "ml-3", "text-danger");
		errorSpan.textContent = errorMessage;
		inputField.insertAdjacentElement("afterend", errorSpan);
	}
}

export function removeErrors(form, fieldName) {
	const existingErrorSpan = form.querySelector(`span.input-error.${fieldName}`);
	if (existingErrorSpan) {
		existingErrorSpan.remove();
	}
	const inputField = form.querySelector(`input[name='${fieldName}']`);
	inputField.classList.remove("error");
}

export function getWindowWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export const handleFormSubmitApi = async (
	form,
	apiFunction,
	formValidations,
	successCallback = () => {},
	errorCallback = () => true
) => {
	const inputs = Array.from(form.querySelectorAll("input"));

	const button = form.querySelector("button[type='submit']");

	inputs.forEach((input) => removeErrors(form, input.name));

	const data = useFormData(form).getObject();

	const errors = formValidations(data);

	if (Object.keys(errors).length > 0) {
		Object.keys(errors).forEach((key) => {
			handleInputError(form, key, errors[key]);
		});
		return;
	}

	try {
		button.setAttribute("processing", "true");
		await apiFunction(data);
		successCallback();
		form.reset();
		button.setAttribute("processing", "false");
	} catch (errors) {
		button.setAttribute("processing", "false");
		if (!errorCallback(errors)) return;
		const errorsKeys = Object.keys(errors);
		if (errorsKeys.includes("detail")) {
			Toast.notify({ type: "error", message: errors.detail });
			return;
		} else if (inputs.some((input) => errorsKeys.includes(input.name))) {
			inputs.forEach((input) => handleInputError(form, input.name, errors[input.name]));
		} else {
			Toast.notify({ type: "error", message: "An error occurred, please try again later" });
		}
	}
};
