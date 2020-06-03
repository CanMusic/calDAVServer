const http = require('http');
const urlencoder = require('urlencoder');
const xml2js = require('xml2js');
const _ = require('lodash');
const fakerator = require('fakerator')('en-US');
var server = new http.Server();

let user_uuid = _.toUpper(fakerator.misc.uuid());
let ics_uuid = _.toUpper(fakerator.misc.uuid());
let tag = fakerator.random.number(1, 100);
console.log(user_uuid);
console.log(ics_uuid);
console.log(tag);

server.on('request', (req, res) => {
	let buf = '';
	req.on('data', (data) => {
		buf += data;
	});

	req.on('end', () => {
		console.log('');
		console.log(`====== request [${req.method}] ${req.url} ======`);
		console.dir({
			method: req.method,
			url: req.url,
			headers: req.headers,
			data: buf
		});

		if (req.method === 'OPTIONS') {
			responseOptions(res);
		} else if (req.method === 'PROPFIND') {
			if (req.url === '/shgbit/' && _.includes(buf, 'supported-calendar-component-sets')) responsePropFind4(res);
			else if (req.url === '/shgbit/' && _.includes(buf, 'calendar-home-set')) responsePropFind3(res);
			else if (req.url === '/shgbit/' && _.includes(buf, 'checksum-versions')) responsePropFind6(res);
			else if (req.url === `/shgbit/${user_uuid}/` && _.includes(buf, 'sync-token')) responsePropFind7(res);
			else if (req.url === `/shgbit/${user_uuid}/` && _.includes(buf, 'getcontenttype')) responsePropFind8(res);
			else if (req.url === `/shgbit/${user_uuid}/`) responsePropFind5(res);
			else if (req.url === '/shgbit/') responsePropFind2(res);
			else if (req.url === '/') responsePropFind1(res);
		} else if (req.method === 'REPORT') {
			if (req.url === `/shgbit/${user_uuid}/` &&
				_.includes(buf, 'comp-filter')) responseReport1(res);
			else if (req.url === `/shgbit/${user_uuid}/` &&
				_.includes(buf, 'calendar-data')) responseReport2(res);
		} else {
			res.writeHead(200);
			res.end();
		}
	});
});

let responsePropFind1 = (res) => {
	console.log('====== responsePropFind1 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:">
  <response>
    <href>/</href>
    <propstat>
      <prop>
        <current-user-principal>
          <href>/shgbit/</href>
        </current-user-principal>
        <resourcetype>
          <collection />
        </resourcetype>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <principal-URL />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind2 = (res) => {
	console.log('====== responsePropFind2 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:">
  <response>
    <href>/shgbit/</href>
    <propstat>
      <prop>
        <principal-URL>
          <href>/shgbit/</href>
        </principal-URL>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind3 = (res) => {
	console.log('====== responsePropFind3 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:CS="http://calendarserver.org/ns/">
  <response>
    <href>/shgbit/</href>
    <propstat>
      <prop>
        <C:calendar-home-set>
          <href>/shgbit/</href>
        </C:calendar-home-set>
        <C:calendar-user-address-set>
          <href>/shgbit/</href>
        </C:calendar-user-address-set>
        <current-user-principal>
          <href>/shgbit/</href>
        </current-user-principal>
        <principal-collection-set>
          <href>/</href>
        </principal-collection-set>
        <principal-URL>
          <href>/shgbit/</href>
        </principal-URL>
        <supported-report-set>
          <supported-report>
            <report>
              <expand-property />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-search-property-set />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-property-search />
            </report>
          </supported-report>
        </supported-report-set>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <displayname />
        <CS:dropbox-home-URL />
        <CS:email-address-set />
        <C:max-attendees-per-instance />
        <CS:notification-URL />
        <resource-id />
        <C:schedule-inbox-URL />
        <C:schedule-outbox-URL />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind4 = (res) => {
	console.log('====== responsePropFind4 ======');
	res.writeHead(207, {
		'Connection': 'keep-alive',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
		'Content-Type': 'text/xml; charset=UTF-8'
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:CS="http://calendarserver.org/ns/" xmlns:ICAL="http://apple.com/ns/ical/" xmlns:ME="http://me.com/_namespace/">
  <response>
    <href>/shgbit/</href>
    <propstat>
      <prop>
        <current-user-privilege-set>
        <privilege>
          <read />
        </privilege>
        </current-user-privilege-set>
        <owner>
          <href>/shgbit/</href>
        </owner>
        <resourcetype>
          <principal />
          <collection />
        </resourcetype>
        <C:supported-calendar-component-sets>
          <C:supported-calendar-component-set>
            <C:comp name="VEVENT" />
          </C:supported-calendar-component-set>
        </C:supported-calendar-component-sets>
        <supported-report-set>
          <supported-report>
            <report>
              <expand-property />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-search-property-set />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-property-search />
            </report>
          </supported-report>
        </supported-report-set>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <add-member />
        <CS:allowed-sharing-modes />
        <ICAL:autoprovisioned />
        <ME:bulk-requests />
        <C:calendar-alarm />
        <ICAL:calendar-color />
        <C:calendar-description />
        <C:calendar-free-busy-set />
        <ICAL:calendar-order />
        <C:calendar-timezone />
        <C:default-alarm-vevent-date />
        <C:default-alarm-vevent-datetime />
        <displayname />
        <CS:getctag />
        <CS:invite />
        <ICAL:language-code />
        <ICAL:location-code />
        <C:max-attendees-per-instance />
        <CS:pre-publish-url />
        <CS:publish-url />
        <CS:push-transports />
        <CS:pushkey />
        <quota-available-bytes />
        <quota-used-bytes />
        <ICAL:refreshrate />
        <resource-id />
        <C:schedule-calendar-transp />
        <C:schedule-default-calendar-URL />
        <CS:source />
        <CS:subscribed-strip-alarms />
        <CS:subscribed-strip-attachments />
        <CS:subscribed-strip-todos />
        <C:supported-calendar-component-set />
        <sync-token />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
  <response>
    <href>/shgbit/${user_uuid}/</href>
    <propstat>
      <prop>
        <ICAL:calendar-color>#579fffff</ICAL:calendar-color>
        <C:calendar-description />
        <current-user-privilege-set>
          <privilege>
            <read />
          </privilege>
        </current-user-privilege-set>
        <displayname>曹炜俊</displayname>
        <CS:getctag>${tag}</CS:getctag>
        <owner>
          <href>/shgbit/</href>
        </owner>
        <resourcetype>
          <C:calendar />
          <collection />
        </resourcetype>
        <C:supported-calendar-component-set>
          <C:comp name="VEVENT" />
        </C:supported-calendar-component-set>
        <C:supported-calendar-component-sets>
          <C:supported-calendar-component-set>
            <C:comp name="VEVENT" />
          </C:supported-calendar-component-set>
        </C:supported-calendar-component-sets>
        <supported-report-set>
          <supported-report>
            <report>
              <expand-property />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-search-property-set />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <principal-property-search />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <sync-collection />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <C:calendar-multiget />
            </report>
          </supported-report>
          <supported-report>
            <report>
              <C:calendar-query />
            </report>
          </supported-report>
        </supported-report-set>
        <sync-token>https://Bytedance.org/sync/${tag}</sync-token>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <add-member />
        <CS:allowed-sharing-modes />
        <ICAL:autoprovisioned />
        <ME:bulk-requests />
        <C:calendar-alarm />
        <C:calendar-free-busy-set />
        <ICAL:calendar-order />
        <C:calendar-timezone />
        <C:default-alarm-vevent-date />
        <C:default-alarm-vevent-datetime />
        <CS:invite />
        <ICAL:language-code />
        <ICAL:location-code />
        <C:max-attendees-per-instance />
        <CS:pre-publish-url />
        <CS:publish-url />
        <CS:push-transports />
        <CS:pushkey />
        <quota-available-bytes />
        <quota-used-bytes />
        <ICAL:refreshrate />
        <resource-id />
        <C:schedule-calendar-transp />
        <C:schedule-default-calendar-URL />
        <CS:source />
        <CS:subscribed-strip-alarms />
        <CS:subscribed-strip-attachments />
        <CS:subscribed-strip-todos />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind5 = (res) => {
	console.log('====== responsePropFind5 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:CS="http://calendarserver.org/ns/">
  <response>
    <href>/shgbit/${user_uuid}/</href>
    <propstat>
      <prop>
        <CS:getctag>${tag}</CS:getctag>
        <sync-token>https://Bytedance.org/sync/${tag}</sync-token>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind6 = (res) => {
	console.log('====== responsePropFind6 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:CS="http://calendarserver.org/ns/">
  <response>
    <href>/shgbit/</href>
    <propstat>
      <prop />
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <CS:checksum-versions />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind7 = (res) => {
	console.log('====== responsePropFind7 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:CS="http://calendarserver.org/ns/">
  <response>
    <href>/shgbit/${user_uuid}/</href>
    <propstat>
      <prop>
        <CS:getctag>${tag}</CS:getctag>
        <sync-token>https://Bytedance.org/sync/${tag}</sync-token>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responsePropFind8 = (res) => {
	console.log('====== responsePropFind8 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:">
  <response>
    <href>/shgbit/${user_uuid}/</href>
    <propstat>
      <prop>
        <getcontenttype>text/calendar</getcontenttype>
        <getetag>${tag}</getetag>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
  <response>
    <href>/shgbit/${user_uuid}/${ics_uuid}.ics</href>
    <propstat>
      <prop>
        <getcontenttype>text/calendar;charset=utf-8;component=VEVENT</getcontenttype>
        <getetag>${tag}</getetag>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responseReport1 = (res) => {
	console.log('====== responseReport1 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:">
  <response>
    <href>/shgbit/${user_uuid}/${ics_uuid}.ics</href>
    <propstat>
      <prop>
        <getcontenttype>text/calendar;charset=utf-8;component=VEVENT</getcontenttype>
        <getetag>${tag}</getetag>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responseReport2 = (res) => {
	console.log('====== responseReport2 ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	let body = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:CS="http://calendarserver.org/ns/">
  <response>
    <href>/shgbit/${user_uuid}/${ics_uuid}.ics</href>
    <propstat>
      <prop>
        <getetag>${tag}</getetag>
				<C:calendar-data>
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bytedance Inc// Calendar
X-WR-CALNAME:曹炜俊
BEGIN:VEVENT
UID:${ics_uuid}
DTSTART:20200610T103000Z
DTEND:20200610T120000Z
CREATED:20200610T103000Z
DTSTAMP:20200610T103000Z
SUMMARY:test
LOCATION:静安寺
END:VEVENT
END:VCALENDAR
				</C:calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
    <propstat>
      <prop>
        <CS:created-by />
        <CS:updated-by />
      </prop>
      <status>HTTP/1.1 404 Not Found</status>
    </propstat>
  </response>
</multistatus>`;
	res.write(body);
	res.end();
	console.log(body);
	console.log('==================');
};

let responseOptions = (res) => {
	console.log('====== responseOptions ======');
	res.writeHead(200, {
		'Connection': 'keep-alive',
		'Allow': 'DELETE, GET, HEAD, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT',
		'DAV': '1, 2, 3, calendar-access, addressbook, extended-mkcol',
	});
	res.end();
};

server.listen(9007);
console.log('server started at 9007......');
