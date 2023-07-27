document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#myForm");
  const submitButton = document.querySelector("#submitButton");
  const plusMinusInput = document.querySelector(".plus-minus-input");

  function handleButtonSelection() {
    const selectedButton = document.querySelector(
      '.inline-buttons input[name="Coming"]:checked'
    );
    const sideButton = document.querySelector('.which-side input[name="Side"]');
    const amountInvitedInput = document.querySelector(
      'input[name="Amount Invited"]'
    );
    const areYouComing = document.querySelector(".invitation-amount");

    if (selectedButton.id === "btnradio5") {
      plusMinusInput.classList.add("show");
      plusMinusInput.style.display = "flex";
      plusMinusInput.style.justifyContent = "center";
      plusMinusInput.style.alignItems = "center";
      areYouComing.style.display = "block";
      amountInvitedInput.value = 1;
    } else {
      plusMinusInput.classList.remove("show");
      areYouComing.style.display = "none";
      amountInvitedInput.value = 0;
    }
  }

  form.addEventListener("click", function (event) {
    if (event.target.matches('.inline-buttons input[name="Coming"]')) {
      handleButtonSelection();
    }
  });

  const plusButtons = document.querySelectorAll('[data-quantity="plus"]');
  plusButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const fieldName = this.getAttribute("data-field");
      const inputField = document.querySelector(`input[name="${fieldName}"]`);
      const currentVal = parseInt(inputField.value) || 0;
      inputField.value = Math.min(currentVal + 1, 15);
    });
  });

  const minusButtons = document.querySelectorAll('[data-quantity="minus"]');
  minusButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const fieldName = this.getAttribute("data-field");
      const inputField = document.querySelector(`input[name="${fieldName}"]`);
      const currentVal = parseInt(inputField.value) || 0;
      inputField.value = Math.max(currentVal - 1, 1);
    });
  });

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "grey";
    submitButton.textContent = "...שולח";

    const resetForm = () => {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "";
      submitButton.textContent = "שלח";
    };

    const data = new FormData(form);
    const action = form.action;

    const selectedButton = document.querySelector(
      '.inline-buttons input[name="Coming"]:checked'
    );

    if (selectedButton) {
      const buttonName = selectedButton.getAttribute("name");
      const buttonValue = selectedButton.getAttribute("value");
      data.append(buttonName, buttonValue);

      if (buttonValue === "yes") {
        const selectedSideButton = document.querySelector(
          '.which-side input[name="Side"]:checked'
        );
        if (selectedSideButton) {
          const sideButtonName = selectedSideButton.getAttribute("name");
          const sideButtonValue = selectedSideButton.getAttribute("value");
          data.append(sideButtonName, sideButtonValue);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: ":) אנא בחר את צדך - חתן או כלה",
          });
          resetForm();
          return;
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "",
        text: ":) לא בחרת אם אתה מגיע או לא",
      });
      resetForm();
      return;
    }

    if (form.checkValidity()) {
      try {
        await fetch(action, {
          method: "POST",
          body: data,
        });

        Swal.fire({
          icon: "success",
          title: "תודה רבה",
          text: " :) מחכים לראותכם בחתונה",
        });

        resetForm();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "",
          text: "הייתה בעיה עם שליחת הטופס נסה שוב עוד כמה דקות",
        });

        resetForm();
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "",
        text: ":) לא לשכוח למלא את כל הפרטים",
      });
      resetForm();
    }
  });
});
const { createClient } = supabase;
supabase = createClient(
  "https://wziiguihgxuxzmuwqmdm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aWlndWloZ3h1eHptdXdxbWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAyOTY3NTgsImV4cCI6MjAwNTg3Mjc1OH0._Oo28KpI4Xwk6HCziWdrYMg-Q2h15lkiYhwhgtkRlBo",
  { debug: true }
);
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  // Get the selected "Coming" option
  const comingOptions = document.querySelectorAll('input[name="Coming"]');
  let selectedComingOption = "no"; // Default value
  comingOptions.forEach((option) => {
    if (option.checked) {
      selectedComingOption = option.value;
    }
  });
  // Function to extract the event name from the URL
  function extractEventNameFromURL() {
    const url = new URL(window.location.href);
    const path = url.pathname;
    const parts = path.split("/");
    const eventName = parts[parts.length - 1];
    return eventName;
  }
  // Get the selected "Side" option
  const sideOptions = document.querySelectorAll('input[name="Side"]');
  let selectedSideOption = null; // Default value as null
  sideOptions.forEach((option) => {
    if (option.checked) {
      selectedSideOption = option.value;
    }
  });
  // Get form reference after the click event
  const form = document.querySelector("#myForm");
  const formInputs = form.querySelectorAll("input, button");
  let submition = {};
  formInputs.forEach((element) => {
    const { value, name, type } = element;
    if (type !== "radio" && value) {
      submition[name] = value;
    }
  });

  // Add the selected radio button values to the submition object
  submition["Coming"] = selectedComingOption;
  submition["Side"] = selectedSideOption;
  // console.log("Form Submission Data:", submition);
  // Extract the table name from the URL
  const tableName = extractEventNameFromURL();

  const { error } = await supabase
    .from(tableName)
    .insert([submition], { returning: "minimal" });
  if (error) {
    alert("There was an error please try again");
  }
});
