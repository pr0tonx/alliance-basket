const submitGroupButton = document.getElementById('submitGroupButton');
const groupNameInput = document.getElementById('adjunct');

const baseUrl = 'http://localhost:8080';

submitGroupButton.addEventListener('click', async (e) => {
   e.preventDefault();

   const body = {groupName: groupNameInput.value};
   const options = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': window.localStorage.getItem('token')
      },
      body: JSON.stringify(body)
   };

   try {
      const response = await fetch(`${baseUrl}/clients/${window.localStorage.getItem('id')}/groups`, options);
      const res = await response.json();

      if (res.error) {
         console.log(res);
         // faz algo pra mostrar pro usuário
         return;
      }

   } catch (err) {
      console.log(err);
   }
});


