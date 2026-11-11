/* Open seats and the "Take a seat" form, shared by every version (including the poster). Preview only: nothing is sent. */
/* Open seats: spots still free on the team. Every version shows these and opens the same "Take a seat" form. */
const OPEN_SEATS = [
  {role: 'Studio Instructor', where: 'Leslieville'},
  {role: 'Studio Assistant', where: 'Both studios'},
  {role: 'Your name here', where: 'Tell us what you would bring'},
];
/* Preview only: the form does not send anything yet. The real one would post to the hiring Google Form. */
function joinDialog(){
  const el = document.createElement('div');
  el.className = 'join'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'j-title');
  el.innerHTML = `<div class="jcard">
    <button class="x" type="button" aria-label="Close">×</button>
    <p class="role" id="j-where"></p><h3 id="j-title">Take a seat</h3>
    <p class="lede">Tell us a little about you. We read every request, and we will reply by email.</p>
    <form>
      <label>Your name<input name="name" required autocomplete="name"></label>
      <label>Email<input name="email" type="email" required autocomplete="email"></label>
      <label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label>
      <label>Seat<select name="seat">${OPEN_SEATS.map((s, k) => `<option value="${k}">${s.role}${k < 2 ? ' (' + s.where + ')' : ''}</option>`).join('')}</select></label>
      <label>Tell us about you<textarea name="about" placeholder="Your clay experience, why OOTB, when you can work"></textarea></label>
      <label>Link to your work or resume (optional)<input name="link" type="url" placeholder="https://"></label>
      <button class="go" type="submit">Send request</button>
      <p class="fine">You need to be allowed to work in Canada. We only use this to answer your request. Preview only: nothing is sent yet.</p>
    </form>
    <div class="done"><b>Seat saved</b><span>Thank you. We will be in touch.</span></div></div>`;
  document.body.appendChild(el);
  const card = el.querySelector('.jcard'), sel = el.querySelector('select');
  let opener = null;
  const where = k => { el.querySelector('#j-where').textContent = OPEN_SEATS[k].where; el.querySelector('#j-title').textContent = k === 2 ? 'Take a seat' : OPEN_SEATS[k].role; };
  function open(k, from){ opener = from || document.activeElement; card.classList.remove('sent'); sel.value = k; where(k); el.classList.add('open'); card.querySelector('input').focus(); }
  function close(){ el.classList.remove('open'); opener && opener.focus && opener.focus(); }
  card.querySelector('.x').onclick = close;
  el.addEventListener('click', e => { if (e.target === el) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('open')) close(); });
  sel.addEventListener('change', () => where(+sel.value));
  card.querySelector('form').addEventListener('submit', e => { e.preventDefault(); card.classList.add('sent'); });
  return open;
}
