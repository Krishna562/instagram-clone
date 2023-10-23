import { useFormContext } from "react-hook-form";
import findError from "../utils/findErr";
import { useSelector } from "react-redux";
import { BiErrorCircle } from "react-icons/bi";

const Input = ({ placeholder, type, field }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = useSelector((state) => state.error.err);
  const errObj = findError(field, errors);
  let respectiveErrObj;
  if (error.errors) {
    respectiveErrObj = error.errors.find((errObj) => errObj.field === field);
  }

  return (
    <div className="form__inputCon">
      <input
        autoComplete="on"
        type={type}
        className="form__input"
        placeholder={placeholder}
        name={field}
        {...register(field)}
      />
      {errObj && (
        <p className="form__inputErr">
          <BiErrorCircle />
          {errObj.message}
        </p>
      )}
      {!errObj && respectiveErrObj && (
        <p className="form__inputErr">
          <BiErrorCircle />
          {respectiveErrObj.message}
        </p>
      )}
    </div>
  );
};

export default Input;
