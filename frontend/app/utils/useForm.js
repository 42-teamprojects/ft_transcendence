export function useForm(formElement) {
	return {
		getValues: function () {
			return Array.from(formElement.elements).reduce((values, element) => {
				if (element.name) {
					values[element.name] = element.value;
				}
				return values;
			}, {});
		},
		setValues: function (newValues) {
			Object.keys(newValues).forEach((key) => {
				if (formElement.elements[key]) {
					formElement.elements[key].value = newValues[key];
				}
			});
		},
		reset: function () {
			formElement.reset();
		},
	};
}

export function useFormData(formElement) {
	return {
		getValues: function () {
			return new FormData(formElement);
		},
		getObject: function () {
			return Object.fromEntries(new FormData(formElement));
		},
		setValues: function (newValues) {
			Object.keys(newValues).forEach((key) => {
				if (formElement.elements[key]) {
					formElement.elements[key].value = newValues[key];
				}
			});
		},
		reset: function () {
			formElement.reset();
		},
	};
}
