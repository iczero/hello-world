function derp(a) {
  return a + '!';
}
export default () => <>
  <div>{derp('Hello')}</div>
  <style jsx>{`
    div {
      color: red;
    }
  `}</style>
</>;
