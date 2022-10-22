const URL = "http://localhost:3000/database";
const carsList = document.getElementById("cars-list");
const servicesList = document.getElementById("history-list");
const carRegList = document.getElementById("pick-car");

async function fetchApi() {
  const data = await fetch("http://localhost:3000/database", {
    method: "GET",
  });
  const dataObj = await data.json();
  // console.log(dataObj.data);
  // console.log(dataObj.data[1]);
  // console.log("owner  :", dataObj.data[1].owner);
  const cars = dataObj.data;
  cars.map((car) => {
    // console.log("car", car);
    const carRow = document.createElement("tr");
    const carOwner = document.createElement("td");
    const carBrand = document.createElement("td");
    const carModel = document.createElement("td");
    const carYear = document.createElement("td");
    const carReg = document.createElement("td");
    const carDelBtn = document.createElement("button");
    const carUpdateBtn = document.createElement("button");
    const carRegListOption = document.createElement("option");
    carRegListOption.innerText = car.registration;
    carRegListOption.value = car.car_id;
    carReg.classList.add("car-reg-box");
    carDelBtn.classList.add("delete-car");
    carDelBtn.innerText = "Изтрий!";
    carDelBtn.addEventListener("click", () => {
      deleteCar(car.registration);
    });
    carUpdateBtn.classList.add("update-car");
    carUpdateBtn.innerText = "Редактирай!";
    carUpdateBtn.addEventListener("click", () => {
      updateCarFillForm(car.car_id);
    });
    carOwner.innerText = car.owner;
    carBrand.innerText = car.brand;
    carModel.innerText = car.model;
    carYear.innerText = car.year;
    carReg.innerText = car.registration;
    carRow.appendChild(carOwner);
    carRow.appendChild(carBrand);
    carRow.appendChild(carModel);
    carRow.appendChild(carYear);
    carRow.appendChild(carReg);
    carRow.appendChild(carDelBtn);
    carRow.appendChild(carUpdateBtn);
    carRegList.appendChild(carRegListOption);
    // console.log("this row", carRow);
    // console.log("this", carsList);
    carsList.appendChild(carRow);
    carReg.addEventListener("click", () => {
      //clear service history
      servicesList.innerHTML = "";

      console.log("click", carReg.innerText, car.car_id);
      fetchServiceApi(carReg.innerText, car.car_id);
    });
  });
  return dataObj;
}

async function deleteCar(carReg) {
  console.log(carReg);
  await fetch(
    `http://localhost:3000/database?field=registration&type=${carReg}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
async function updateCarFillForm(carId) {
  console.log(carId);
  const data = await fetch(
    `http://localhost:3000/database?field=car_id&type=${carId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const dataObj = await data.json();
  const carInfo = dataObj.data[0];
  console.log(carInfo);
  const { owner, brand, model, year, registration } = carInfo;
  console.log(owner, brand, model, year, registration);
  const ownerInput = document.getElementById("owner");
  const brandInput = document.getElementById("brand");
  const modelInput = document.getElementById("model");
  const yearInput = document.getElementById("year");
  const regInput = document.getElementById("registration");
  ownerInput.value = owner;
  brandInput.value = brand;
  modelInput.value = model;
  yearInput.value = year;
  regInput.value = registration;
  const updateCarButton = document.getElementById("car-update");
  updateCarButton.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(carForm);
    const formProps = Object.fromEntries(formData);
    const data = JSON.stringify(formProps);
    console.log(data);
    updateCar(data, carId);
    // console.log(
    //   ownerInput.value,
    //   brandInput.value,
    //   modelInput.value,
    //   yearInput.value,
    //   regInput.value
    // );
    // const updatedData =
    // updateCar();
  });
}

async function updateServiceFillForm(serviceId, carId) {
  console.log(serviceId);
  const data = await fetch(
    `http://localhost:3000/service?field=service_id&type=${serviceId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const dataObj = await data.json();
  const serviceInfo = dataObj.data[0];
  console.log(serviceInfo);
  const { date, km, text, event, next_date, next_change, car } = serviceInfo;
  console.log(date, km, text, event, next_date, next_change, car);
  // console.log(regNum);
  const dateInput = document.getElementById("date");
  const kmInput = document.getElementById("km");
  const textInput = document.getElementById("text");
  const eventInput = document.getElementById("event");
  const next_dateInput = document.getElementById("next_date");
  const next_changeInput = document.getElementById("next_change");
  const carInput = document.getElementById("pick-car");
  dateInput.value = date;
  kmInput.value = km;
  textInput.value = text;
  if (event != null) {
    eventInput.checked = true;
  } else {
    eventInput.checked = false;
  }
  next_dateInput.value = next_date;
  next_changeInput.value = next_change;
  // carInput.value = regNum;
  carInput.value = carId;
  const updateServiceButton = document.getElementById("service-update");
  updateServiceButton.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(serviceForm);
    const formProps = Object.fromEntries(formData);
    const data = JSON.stringify(formProps);
    console.log(data);
    updateService(data, serviceId);
    // console.log(
    //   ownerInput.value,
    //   brandInput.value,
    //   modelInput.value,
    //   yearInput.value,
    //   regInput.value
    // );
    // const updatedData =
    // updateCar();
  });
}

fetchApi();

const carForm = document.getElementById("car-form");
carForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const data = JSON.stringify(formProps);
  console.log(data);
  createCar(data);
}

async function createCar(data) {
  await fetch("http://localhost:3000/database", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
}

async function updateCar(data, carId) {
  await fetch(`http://localhost:3000/database/${carId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
}

async function updateService(data, serviceId) {
  console.log("data", data);
  await fetch(`http://localhost:3000/service/${serviceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
}

//add service

async function fetchServiceApi(regNum, carId) {
  const data = await fetch(
    `http://localhost:3000/service?field=car&type=${carId}`,
    {
      method: "GET",
    }
  );
  const dataObj = await data.json();
  console.log(dataObj.data);
  console.log(dataObj.data[0]);
  const services = dataObj.data;
  services.map((service) => {
    console.log(service);
    const serviceRow = document.createElement("tr");
    const serviceDate = document.createElement("td");
    const serviceKm = document.createElement("td");
    const serviceText = document.createElement("td");
    const serviceEvent = document.createElement("td");
    const serviceNextDate = document.createElement("td");
    const serviceNextChange = document.createElement("td");
    const serviceDelBtn = document.createElement("button");
    const serviceUpdateBtn = document.createElement("button");
    const regNumSpan = document.getElementById("reg-span");
    regNumSpan.innerText = regNum;
    serviceDelBtn.classList.add("delete-service");
    serviceDelBtn.innerText = "Изтрий!";
    serviceDelBtn.addEventListener("click", () => {
      deleteService(service.service_id);
    });
    serviceUpdateBtn.classList.add("update-service");
    serviceUpdateBtn.innerText = "Редактирай!";
    serviceUpdateBtn.addEventListener("click", () => {
      updateServiceFillForm(service.service_id, carId);
    });
    if (service.event == null) {
      serviceEvent.innerText = "не";
    } else {
      serviceEvent.innerText = service.event;
    }
    serviceDate.innerText = service.date;
    serviceKm.innerText = service.km;
    serviceText.innerText = service.text;
    serviceNextDate.innerText = service.next_date;
    serviceNextChange.innerText = service.next_change;
    serviceRow.appendChild(serviceDate);
    serviceRow.appendChild(serviceKm);
    serviceRow.appendChild(serviceText);
    serviceRow.appendChild(serviceEvent);
    serviceRow.appendChild(serviceNextDate);
    serviceRow.appendChild(serviceNextChange);
    serviceRow.appendChild(serviceDelBtn);
    serviceRow.appendChild(serviceUpdateBtn);
    // console.log("this row", carRow);
    // console.log("this", servicesList);
    servicesList.appendChild(serviceRow);
  });
  return dataObj;
}

//ADD NEW SERVICE
const serviceForm = document.getElementById("service-form");
serviceForm.addEventListener("submit", handleServiceSubmit);

function handleServiceSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const data = JSON.stringify(formProps);
  console.log("data", data);
  createService(data);
  // fetchServiceApi(carReg.innerText, car.car_id);
}
async function createService(data) {
  await fetch("http://localhost:3000/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
}

async function deleteService(serviceId) {
  console.log(serviceId);
  await fetch(
    `http://localhost:3000/service?field=service_id&type=${serviceId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
