const modal = document.getElementById('modal');
const modal2 = document.getElementById('modal2');
const modal3 = document.getElementById('modal3');
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modalForm = document.getElementById('modalForm');


//Functions

//Function to open  the next modal
function openModal(modalId){
    //Hide all modals
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');

    //Show specified modal
    document.getElementById(modalId).style.display = 'flex';
}

//Function to close a modal
function closeModal(modalId){
    document.getElementById(modalId).style.display = 'none'
}




//Open modal
openModalButton.addEventListener('click', () => {
    modal.style.display = 'flex'; 
});

//Close the modal
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close when clicking outside the content
window.addEventListener('click', (event) => {
    if(event.target === modal || event.target === modal2 || event.target === modal3){
        modal.style.display = 'none';
        modal2.style.display = 'none';
        modal3.style.display = 'none';
    }
});

modalForm.addEventListener('submit', (event) => {
    event.preventDefault(); //Prevent default form submission
    alert('Form submitted successfully!');
    modal.style.display = 'none'; //Close the modal
});


