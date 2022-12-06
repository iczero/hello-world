import { Head } from '../util';
import { keccakRand } from '../keccak-container';
import React, { useEffect, useRef, useState } from 'react';
import type { Faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';

export async function getFaker() {
  // external import: faker.js is about 5 MB minified and as hilarious as that
  // would be, 5 MB pages don't load very fast
  const imported = await import('https://cdn.skypack.dev/@faker-js/faker');
  let faker = new imported.Faker({ locales: imported.faker.locales });
  // use keccak as implementation for rng
  // this is a pile of hacks and probably won't work in the near future
  let fakerUntyped = faker as any;
  if (fakerUntyped._mersenne) {
    fakerUntyped._mersenne.next =
      ({ min, max }: { min: number; max: number }): number => keccakRand.int(min, max);
  } else if (fakerUntyped.mersenne) {
    fakerUntyped.mersenne.rand = (max: number, min: number) => keccakRand.int(min, max);
  }
  return faker;
}

export function FakerPage() {
  let [loaded, setLoaded] = useState(false);
  let f = useRef<Faker | null>(null);
  useEffect(() => void (async () => {
    f.current = await getFaker();
    setLoaded(true);
  })(), []);
  return <>
    <Head><title>Faker.js generator</title></Head>
    <h2>Faker.js generator</h2>
    {loaded
      ? <FakerList faker={f.current!} />
      : <p>Loading. Please be patient, this may take a very long time</p>}
    <p><a href="https://github.com/faker-js/faker">Faker.js on GitHub</a></p>
    <Link to="/">Go home</Link>
  </>;
}

export function FakerEntry({ fn, name }: { fn: () => any; name: string }) {
  let [output, setOutput] = useState(fn());
  let refresh = () => setOutput(fn());
  return <tr>
    <td style={{ textAlign: 'end' }}><button onClick={refresh}>{name}</button></td>
    <td>{output}</td>
  </tr>;
}

export function FakerList({ faker }: { faker: Faker }) {
  return <table>
    <tbody>
      <FakerEntry name="Name" fn={faker.name.fullName} />
      <FakerEntry name="Address" fn={faker.address.streetAddress} />
      <FakerEntry name="Birthday" fn={() => faker.date.birthdate().toDateString()} />
      <FakerEntry name="Email" fn={faker.internet.email} />
      <FakerEntry name="Password" fn={faker.internet.password} />
      <FakerEntry name="Job title" fn={faker.name.jobTitle} />
      <FakerEntry name="Company" fn={faker.company.name} />
      <FakerEntry name="BS" fn={faker.company.bs} />
    </tbody>
  </table>;
}
