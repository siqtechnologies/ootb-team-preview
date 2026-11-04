/* Shared by the alternative versions (v2, v3, v4): team data, the version switcher and the
   photo-left / bio-right popup. Version 1 (index.html) keeps its own copy with poster positions. */
/* Pets follow the person they sit with on the poster: Naicha with Joanna, Momo with Mia, Remy next to Janice. */
const TEAM = [
  {name:"Joanna", role:"Co-founder", hd:true, tags:["Big picture ideas","Brand building","New experiences"],
   bio:"Meet Joanna! The big picture thinker and idea generator behind OOTB. With an entrepreneurial spirit and a love for turning ideas into reality, she's always dreaming up new projects and finding ways to bring people together. From building the OOTB brand to creating new experiences, she loves making things happen (and occasionally having way too many ideas at once!). For her, OOTB is more than a pottery studio: it's a place for creativity, connection, and a little bit of chaos."},
  {name:"Naicha", role:"Studio friend", pet:true, with:"Joanna", hd:true, tags:[], bio:"Bio coming soon."},
  {name:"Mia", role:"Co-founder", hd:true, tags:[], bio:"Bio coming soon."},
  {name:"Momo", role:"Studio friend", pet:true, with:"Mia", hd:true, tags:[], bio:"Bio coming soon."},
  {name:"Jonas", role:"OOTB team", hd:true, tags:["Plant parent","Side quests","Getting your hands dirty"],
   bio:"This is Jonas, a part time plant parent, full time creative with too many side quests. Currently accepting clay as another personality trait. If I'm not making something, I'm probably thinking about making something. Here to help you get your hands dirty. No, your pottery does not have to look like the Pinterest reference."},
  {name:"Janice", role:"OOTB team", hd:true, tags:["Whimsical ceramics","Everyday inspiration","2 cats and a puppy"],
   bio:"Meet Janice, a clay enthusiast with too many hobbies and not enough hours. She makes whimsical ceramics inspired by everyday things and joined OOTB to help others fall in love with clay, wobbles and all. She is also a proud mom to 2 cats and one puppy. If she's not at the studio, she's probably thinking about being at the studio."},
  {name:"Remy", role:"Chief greeter", pet:true, with:"Janice", hd:true, tags:["Greeting everyone","Floor supervisor","Paid in treats"],
   bio:"Meet Remy, OOTB's cutest employee. He's just a puppy but already has a full time job greeting everyone who walks in. You can find him at the studio on occasional weekdays, supervising from the floor and accepting treats as payment."},
  {name:"Bonnie", role:"Instructor", hd:true, tags:["Multidisciplinary artist","3 years in ceramics","Nature and movies"],
   bio:"I'm a multidisciplinary artist and I am one of the instructors at OOTB. I have been working with ceramics for about three years now. Outside of ceramics, I enjoy being outside in nature and watching movies. My teaching philosophy is that failure is a part of great artmaking!"},
  {name:"Nadine", role:"OOTB team", hd:true, tags:[], bio:"Bio coming soon."},
  {name:"Anie", role:"Instructor", tags:["Organic shaped vessels","Candle lit dinners","Patience and intention"],
   bio:"Meet Anie! An instructor at OOTB who loves to make organic shaped vessels. Outside of making pots, she loves to bike around the city and host candle lit dinner parties with friends. She joined OOTB to combine her love of pottery and hosting, to build a community and teach skills of patience, gratitude, and intentionality."},
  {name:"Emma", role:"OOTB team", tags:[], bio:"Bio coming soon."},
];
const people = () => TEAM.filter(m => !m.pet);
const petsOf = m => TEAM.filter(p => p.with === m.name);
const idx = m => TEAM.indexOf(m);
const photo = m => m.hd ? `img/md/${m.name.toLowerCase()}.webp` : null;   // popup size
const thumb = m => m.hd ? `img/sm/${m.name.toLowerCase()}.webp` : null;  // grid size

const VERSIONS = [
  ["index.html", "Poster"],
  ["v2-tiles.html", "Glaze test tiles"],
  ["v3-shelf.html", "Drying shelf"],
  ["v4-cards.html", "Crew cards"],
  ["v5-plan.html", "Studio plan"],
  ["v6-polaroids.html", "Polaroids"],
  ["v7-covers.html", "Magazine covers"],
];
function versionNav(active){
  const nav = document.createElement('nav');
  nav.className = 'vnav';
  nav.innerHTML = '<b>Team section:</b>' + VERSIONS.map(([href, label]) =>
    `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  document.body.prepend(nav);
}

/* Popup: photo left, bio right. photoBg(m, i) returns the CSS background for the photo side. */
function teamPopup({photoBg = () => '#c9dcf4', onOpen} = {}){
  const pop = document.createElement('div');
  pop.className = 'tm-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-labelledby', 'p-name');
  pop.innerHTML = `<article class="tm-card">
    <button class="x" aria-label="Close">×</button>
    <div class="photo"></div>
    <div class="body"><p class="role"></p><h3 id="p-name"></h3><ul class="tags"></ul><p class="bio"></p>
      <div class="nav"><button class="prev">← Previous</button><button class="next">Next →</button></div></div></article>`;
  document.body.appendChild(pop);
  const $ = s => pop.querySelector(s);
  let cur = 0, opener = null;
  function fill(i){
    const m = TEAM[cur = (i + TEAM.length) % TEAM.length], ph = $('.photo');
    ph.style.background = photoBg(m, cur);
    ph.innerHTML = photo(m) ? `<img src="${photo(m)}" alt="${m.name} at OOTB Pottery">` : `<span class="ini">${m.name[0]}</span>`;
    $('.role').textContent = m.role; $('#p-name').textContent = m.name;
    $('.tags').innerHTML = m.tags.map(t => `<li>${t}</li>`).join('');
    $('.bio').textContent = m.bio;
    onOpen && onOpen(m, cur);
  }
  function open(i, from){ opener = from || document.activeElement; fill(i); pop.classList.add('open'); $('.x').focus(); }
  function close(){ pop.classList.remove('open'); opener && opener.focus && opener.focus(); }
  $('.x').onclick = close; $('.prev').onclick = () => fill(cur - 1); $('.next').onclick = () => fill(cur + 1);
  pop.addEventListener('click', e => { if (e.target === pop) close(); });
  addEventListener('keydown', e => {
    if (!pop.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') fill(cur + 1);
    if (e.key === 'ArrowLeft') fill(cur - 1);
  });
  if (/^#open=\d+$/.test(location.hash)) setTimeout(() => open(+location.hash.slice(6)));   // deep link, e.g. #open=2
  return open;
}
