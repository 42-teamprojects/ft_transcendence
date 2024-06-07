import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
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

	const inputField =
		form.querySelector(`input[name='${fieldName}']`) || form.querySelector(`input[id='${fieldName}']`);
	if (!inputField) {
		console.error(`Input field with name or id ${fieldName} not found`);
		return;
	}
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

/**
 * Handles form submission and makes an API call.
 * @param {HTMLFormElement} form - The form element.
 * @param {Function} apiFunction - The API function to call.
 * @param {Function} formValidations - The function to validate form data.
 * @param {Function} [successCallback=()=>{}] - The callback function to execute on successful API call.
 * @param {Function} [errorCallback=()=>true] - The callback function to execute on API call error.
 */
export const handleFormSubmitApi = async (
	form,
	apiFunction,
	formValidations,
	successCallback = (data = {}) => {},
	errorCallback = () => {}
) => {
	const inputs = Array.from(form.querySelectorAll("input")); // Get all input elements within the form
	if (!inputs.length) {
		console.error("No input elements found");
		return;
	}

	const button = form.querySelector("button[type='submit']") || form.querySelector("button"); // Get the submit button element
	if (!button) {
		console.error("Submit button not found");
		return;
	}

	inputs.forEach((input) => removeErrors(form, input.name)); // Remove any existing error messages for each input

	const data = useFormData(form).getObject(); // Get the form data as an object using the useFormData utility function

	const errors = formValidations(data); // Validate the form data using the provided formValidations function
	if (!errors) return; // Stop further execution if there are no validation errors

	if (Object.keys(errors).length > 0) {
		// If there are validation errors
		Object.keys(errors).forEach((key) => {
			handleInputError(form, key, errors[key]); // Display error messages for each input with errors
		});
		return; // Stop further execution
	}

	try {
		button.setAttribute("processing", "true"); // Set the button attribute to indicate processing
		await apiFunction(data); // Call the API function with the form data
		successCallback(data); // Call the success callback function
		form.reset(); // Reset the form
		button.setAttribute("processing", "false"); // Set the button attribute to indicate processing is complete
	} catch (errors) {
		button.setAttribute("processing", "false"); // Set the button attribute to indicate processing is complete
		errorCallback(errors) // Call the error callback function and stop further execution if it returns false

		// Show error messages
		const errorsKeys = Object.keys(errors);
		if (errorsKeys.includes("detail")) {
			Toast.notify({ type: "error", message: errors.detail }); // Display a toast notification with the error detail
			return; // Stop further execution
		} else if (inputs.some((input) => errorsKeys.includes(input.name))) {
			inputs.forEach((input) => handleInputError(form, input.name, errors[input.name])); // Display error messages for inputs with errors
		} else {
			Toast.notify({ type: "error", message: "An error occurred, please try again later" }); // Display a generic error toast notification
		}
	}
};

export function getMatchUrl(regex) {
	const url = Router.instance.currentRoute;
	const match = url.match(regex);
	return match ? match[1] : null;
}

// trim consecutive slashes
export function trimSlashes(str) {
	return str.replace(/\/{2,}/g, "/");
}

// get time passed based on current time and a given time, in a format m, h, d, w, y
export function getTimePassed(date) {
	const now = new Date();
	const timePassed = now - new Date(date);
	const seconds = timePassed / 1000;
	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = hours / 24;
	const weeks = days / 7;
	const months = days / 30;
	const years = days / 365;

	if (seconds < 60) return "now";
	if (minutes < 60) return `${Math.floor(minutes)}m`;
	if (hours < 24) return `${Math.floor(hours)}h`;
	if (days < 7) return `${Math.floor(days)}d`;
	if (weeks < 4) return `${Math.floor(weeks)}w`;
	if (months < 12) return `${Math.floor(months)}mo`;
	return `${Math.floor(years)}y`;
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].toLowerCase() === value.toLowerCase());
}

export function startCountdown(time, onUpdateCallback = (output) => {console.log(output)}, onEndCallback = () => {}) {
	const countdown = setInterval(() => {
		const now = new Date();
		const diff = time - now; // Difference in milliseconds

		if (diff <= 0) {
			clearInterval(countdown);
			onEndCallback();
		} else {
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			const output = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
			onUpdateCallback(output);
		}
	}, 1000);

	return countdown;
}

export function isTimePast(time) {
	const now = new Date();
	return time < now;
}