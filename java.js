const toggleDropdown = (dropdown) => {
    dropdown.classList.toggle("yes-child");
}

document.addEventListener("DOMContentLoaded", function(){
    const dropdowns = document.getElementsByClassName('dropdown');
    for (let i=0; i<dropdowns.length; i++) {
        const dropdown = dropdowns[i];
        const trigger = dropdown.getElementsByClassName('dropdown-trigger')[0];
        trigger.addEventListener('click', function () {
            toggleDropdown(dropdown);
        });
    }
});