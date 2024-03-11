import {
      act,
      cleanup,
      queryByTestId,
      render,
      screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IssuePopup from "../components/issueView/IssuePopup.jsx";
import axios from "axios";

jest.mock("axios");

window.alert = jest.fn();

describe("IssuePopup Component", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.slice(-8) === "issues/1") {
        return Promise.resolve({
          data: {
            assignee: "Athul Krishna",
            description: "some desc",
            estimate: "3",
            id: 1,
            priority: "HIGH",
            reporter: "Athul Krishna",
            status: "To Do",
            ticketName: "Ticket One",
            title: "Title Here",
          },
        });
      }
    });
  });
  it("renders properly", async () => {
          render(<IssuePopup issueId={1} onClose={() => {}} />);
          expect(await screen.findByTestId("issue-details")).toBeInTheDocument();
          // screen.debug(undefined, Infinity);
          expect(screen.getByTestId("issue-details")).toBeInTheDocument();
        });
      
        it("can toggle between show/hide details", async () => {
          render(<IssuePopup issueId={1} onClose={() => {}} />);
          // wait till the Loading... is completed
          expect(
            await screen.findByTestId("show-hide-details-button")
          ).toBeInTheDocument();
          // click on the Show Details button
          userEvent.click(screen.getByTestId("show-hide-details-button"));
          // details section must be visible now
          expect(await screen.findByTestId("details-content")).toBeInTheDocument();
        });

});