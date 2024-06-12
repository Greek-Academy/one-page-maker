import { expect, test } from "vitest";
import {ContentConverter} from "../../src/model/ContentConverter";

test("Html", () => {
    expect(ContentConverter.toHtml(`a
b
c
d`)).toEqual("<p>a</p><p>b</p><p>c</p><p>d</p>")});


test("MarkdownText", () => {
    expect(ContentConverter.toMarkdownText(`a
b
c
d`)).toEqual(`a

b

c

d

`)});
