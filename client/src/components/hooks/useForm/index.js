import { useState, useEffect } from "react";

const useForm = (callback, initialValue, validate) => {
  const [values, setValues] = useState(initialValue);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setValues(initialValue);
    setErrors({})
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors, callback, isSubmitting]);

  return [
    handleChange,
    handleSubmit,
    values,
    errors,
    reset
  ];
};

export default useForm;