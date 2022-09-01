import { createWrapper } from "next-redux-wrapper";
import { compose, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log(action);
    return next(action);
  };

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middleware))
      : composeWithDevTools(applyMiddleware(...middleware));

  const store = createStore(rootReducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  // store.dispatch({
  //   type: "",
  // });

  return store;
};

const wrapper = createWrapper(configureStore, {
  debut: process.env.NODE_ENV === "development",
});

export default wrapper;
