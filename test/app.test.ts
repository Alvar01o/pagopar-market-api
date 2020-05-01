import rp from 'request-promise';
import url from 'url';
import app from '../src/app';

const port = app.get('port') || 5000;
const getUrl = pathname =>
  url.format({
    hostname: app.get('host') || 'localhost',
    pathname,
    port,
    protocol: 'http'
  });

describe('Feathers application tests (with jest)', () => {
  beforeAll(done => {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  afterAll(done => {
    this.server.close(done);
  });

  it('starts and shows the index page', () => {
    expect.assertions(1);
    return rp(getUrl(undefined)).then(body => expect(body.indexOf('<html>')).not.toBe(-1));
  });

  describe('404', () => {
    it('shows a 404 HTML page', () => {
      expect.assertions(2);
      return rp({
        headers: {
          Accept: 'text/html'
        },
        url: getUrl('path/to/nowhere')
      }).catch(res => {
        expect(res.statusCode).toBe(404);
        expect(res.error.indexOf('<html>')).not.toBe(-1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      expect.assertions(4);
      return rp({
        json: true,
        url: getUrl('path/to/nowhere')
      }).catch(res => {
        expect(res.statusCode).toBe(404);
        expect(res.error.code).toBe(404);
        expect(res.error.message).toBe('Page not found');
        expect(res.error.name).toBe('NotFound');
      });
    });
  });
});
