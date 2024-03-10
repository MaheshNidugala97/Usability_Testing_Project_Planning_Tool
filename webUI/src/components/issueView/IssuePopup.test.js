import {
    act,
    cleanup,
    queryByTestId,
    render,
    screen,
  } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import IssuePopup from "./IssuePopup";
  import axios from "axios";
  
  jest.mock("axios");
  
  describe("IssuePopup Component", () => {
    beforeEach(() => {
      axios.get.mockImplementation((url) => {
        if (url.slice(-8) === "issues/1") {
          return Promise.resolve({
            data: {
              assignee: "Athul Krishna",
              comment: Array["dummy comment"],
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
        } else if (url.slice(-8) === "/comment") {
          return Promise.resolve({
            data: ["comment 1", "comment 2"],
          });
        }
      });
  
      axios.post.mockImplementation((url) => {
        if (url.slice(-8) === "/comment") {
          return Promise.resolve({
            data: {
              message: "comment submitted successfully",
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
  
    it("allows adding a comment", async () => {
      render(<IssuePopup issueId={1} onClose={() => {}} />);
      // wait till the Loading... is completed
      let commentTA;
      expect(
        (commentTA = await screen.findByTestId("comments-ta"))
      ).toBeInTheDocument();
      // type in the comment text "test-comment-Athul"
      userEvent.type(commentTA, "test-comment-Athul");
      // click on the Submit Comment button
      userEvent.click(screen.getByTestId("add-comment-button"));
      // A new comment with the same text must be visible now
      expect(
        await screen.findByText("test-comment-Athul", { selector: "span" })
      ).toBeInTheDocument();
    });
  });