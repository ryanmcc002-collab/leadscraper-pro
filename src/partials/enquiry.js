'use strict';
/* Enquiry section: copy on the left, form on the right. In demo mode the lead-flow reveal sits under the copy. */
const { esc, attr } = require('../lib/format');

module.exports = function enquiry({ site, machines, heading, lead, machine, showCall = true, grey = false, id = 'enquire' }) {
  const tag = machine ? `tagged "${esc(machine.name)}"` : 'tagged with the machine they asked about';
  const flow = site.demo ? `
      <div class="flow" data-flow aria-live="polite">
        <h3>What happens next on the live site</h3>
        <ol>
          <li><span>The enquiry lands in HubSpot, ${tag}.</span></li>
          <li><span>The buyer gets a text and an email within a minute, so they know you've got it.</span></li>
          <li><span>You get a notification with their name, number and machine.</span></li>
          <li><span>If they go quiet, follow-up emails go out over the next two weeks.</span></li>
        </ol>
      </div>` : '';
  const options = ['Not sure yet', ...machines.map(m => m.name)].map(n =>
    `<option${machine && n === machine.name ? ' selected' : ''}>${esc(n)}</option>`).join('');
  const action = !site.demo && site.enquiry_form_action && !/TODO/i.test(site.enquiry_form_action) ? ` action="${attr(site.enquiry_form_action)}" method="post"` : '';
  return `<section class="section${grey ? ' section--grey' : ''}" id="${attr(id)}">
  <div class="wrap enq">
    <div>
      <h2>${esc(heading)}</h2>
      <p class="lead">${esc(lead)}</p>
      ${showCall ? `<p class="enq__call"><a class="btn btn--call" href="${attr(site.phone_href)}">Call ${esc(site.phone_display)}</a></p>` : ''}${flow}
    </div>
    <form class="form" data-enquiry novalidate${action}>
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err"><p class="field__err" id="f-name-err"></p></div>
      <div class="field"><label for="f-phone">Mobile</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="f-phone-err"><p class="field__err" id="f-phone-err"></p></div>
      <div class="field"><label for="f-machine">Machine you're interested in</label>
        <select id="f-machine" name="machine">${options}</select></div>
      <div class="field"><label for="f-msg">What's the job? (optional)</label><textarea id="f-msg" name="job" rows="3"></textarea></div>
      <div class="field field--check"><input id="f-fin" name="finance" type="checkbox" value="yes"><label for="f-fin">I'd like to hear about finance</label></div>
      <p class="form__status" data-form-status aria-live="polite"></p>
      <button class="btn btn--primary btn--block" type="submit">Send enquiry</button>
    </form>
  </div>
</section>`;
};
