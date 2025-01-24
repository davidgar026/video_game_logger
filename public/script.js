const modal = document.getElementById('modal');
const modal2 = document.getElementById('modal2');
const modal3 = document.getElementById('modal3');
const formElement = modal3.querySelector('form'); // Ensure you're targeting the <form> inside the modal

const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modalForm = document.getElementById('modalForm');
const errorMessage = document.getElementById('error-message'); // Add an element to show errors

//Functions






// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}



// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the `data-modal-id` attribute
    const modalButtons = document.querySelectorAll('[data-modal-id]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('span[data-close-modal]'); // Select all close spans

    // Function to close a modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };

    // Add click event listeners to open modals
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {

            document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
            
            const modalId = button.getAttribute('data-modal-id');
            openModal(modalId);
        });
    });

    // Add click event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-close-modal'); // Get the modal ID to close
            console.log("modalId = ", modalId)
            closeModal(modalId);
        });
    });


    // Add click event listeners to close modals when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

});


/*------------------------------------------------------*/



formElement.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(formElement);
    console.log("formData = ", formData)
    const formObject = Object.fromEntries(formData.entries());
    console.log('Form Object:', formObject);

    try {
        const response = await axios.post('/log-in', formObject, {
            headers: { 'Content-Type': 'application/json' },
        });

        //console.log("response = ", response);
        //console.log("response.data = ", response.data);
        //console.log("response.data.success = ", response.data.success); //its true

        if (response.data.success) {
            errorMessage.style.display = 'none'; // Hide error message
            modal.style.display = 'none'; // Close the modal on success
            window.location.href = '/my-games'; // Redirect to the desired page
        } else {
            // Display the error message and keep the modal open
            errorMessage.textContent = response.data.message;
            errorMessage.style.display = 'block';
        }
        let data = JSON.parse("invalid JSON");
    } catch (error) {
        if (error.response) {
            // Display error message from the server
            errorMessage.textContent = error.response.data.message || 'Invalid username or password.';
        } else {
            // Handle other errors (e.g., network issues)
            console.log("Error message:", error.message); // Human-readable error message
            console.log("Error name:", error.name);       // Type of error
            console.log("Stack trace:", error.stack);     // Call stack for debugging

            errorMessage.textContent = 'An error occurred. Please try again.';
        }
        errorMessage.style.display = 'block'; // Show the error message
    }
});