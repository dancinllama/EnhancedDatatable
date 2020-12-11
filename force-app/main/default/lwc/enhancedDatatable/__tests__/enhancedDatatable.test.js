import { createElement } from 'lwc';
import Example from 'c/example';

describe('c-enhanced-datatable', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Test Enhanced DT with Filter and Summary Rows', () => {
        const exampleElement = createElement('c-example', {
            is: Example
        });
        document.body.appendChild(exampleElement);
        expect(exampleElement).not.toBeNull();

        const datatable = exampleElement.shadowRoot.querySelector(
            'c-enhanced-datatable'
        );
        const rows = datatable.data;

        //should be 13, with filter and summary.
        expect(rows.length).toBe(13);
    });
});