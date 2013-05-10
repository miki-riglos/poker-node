define(function() {

  function formatDate(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return  [months[date.getMonth()], date.getDate()].join(' ')
            + ', ' +
            [('0' + date.getHours()  ).substr(-2),
             ('0' + date.getMinutes()).substr(-2),
             ('0' + date.getSeconds()).substr(-2)].join(':');
  }


  return formatDate;
});