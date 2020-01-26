document.addEventListener("DOMContentLoaded", function(){
    const dropdownTriggers = document.getElementsByClassName('dropdown-trigger');
    for (let i=0; i<dropdownTriggers.length; i++) {
        const dropdownTrigger = dropdownTriggers[i];
        const target = dropdownTrigger.dataset.dropdownTarget;
        
        const dropdowns = document.getElementsByClassName(target);
        
        for (let i=0; i<dropdowns.length; i++) {

            const dropdown = dropdowns[i];
            dropdownTrigger.addEventListener('click', function () {
                dropdown.classList.toggle("visible");
                dropdownTrigger.classList.toggle("active");
            });
        }

    }
});