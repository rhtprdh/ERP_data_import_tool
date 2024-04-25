

function dateLibrary(date) {
    const date1 = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
      }).split('/');
      const dateNewFormate =  `${date1[2]}-${date1[0]}-${date1[1]}`;
      return dateNewFormate;
}

export default dateLibrary;
