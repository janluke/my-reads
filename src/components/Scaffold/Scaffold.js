import React from 'react';
import './Scaffold.scss';
import { PageLoader } from "../utils";
import PageInfo from "components/PageInfo";
import { SvgServerDown, SvgWarning } from "iblis-react-undraw";

/**
 * Simplistic error handling/presentation
 */
function renderError(error) {
  console.log(error.name, error.message);
  let args;
  if (error.name === 'TypeError' && error.message.startsWith('NetworkError')) {
    args = {
      illustration: <SvgServerDown primarycolor="var(--color-error)" />,
      title: "Network Error",
      text: "Error when attempting to fetch data from the server"
    }
  }
  else {
    args = {
      illustration: <SvgWarning primarycolor="var(--color-error)" />,
      title: "Ops! Something went wrong!",
      text: "Error when attempting to fetch data from the server"
    }
  }

  return <PageInfo type="error" {...args} />;
}

/**
 * This is a template component for pages of the application. It handles
 * common layout issues and common logic of pages. For example:
 * - it adapts the padding-top of the main content in function of the height of
 *   the Header (which is different depending on the viewport width);
 * - it shows a loading indicator (in the body) when [loading] is true;
 * - it shows page errors (in the body) when [error] is not null (and [loading] is false).
 *
 * @param header Should be an instance of Header
 * @param renderBody Function that renders the body of the page
 * @param floatingActionButton
 */
function Scaffold({ header, renderBody, floatingActionButton, loading, error }) {
  return (
    <div className="Scaffold">
      {header}

      <main className="Scaffold-body">
        <PageLoader loading={loading}>
          {(error)
            ? () => renderError(error)
            : renderBody}
        </PageLoader>
      </main>

      {floatingActionButton && (
        <div className="Scaffold-fab">
          {floatingActionButton}
        </div>
      )}
    </div>
  );
}

export default Scaffold;
