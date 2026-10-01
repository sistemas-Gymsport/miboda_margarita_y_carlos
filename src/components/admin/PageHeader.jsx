export default function PageHeader({ title, description, actions }) {
  return (
    <header className="a-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="a-row">{actions}</div> : null}
    </header>
  );
}
