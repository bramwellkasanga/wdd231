const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
    technology: ["HTML", "CSS"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

const courseList = document.querySelector("#course-list");
const courseSummary = document.querySelector("#course-summary");
const filterButtons = document.querySelectorAll(".filter-button");

function renderCourses(filter = "ALL") {
  if (!courseList || !courseSummary) {
    return;
  }

  const visibleCourses =
    filter === "ALL"
      ? courses
      : courses.filter((course) => course.subject === filter);
  const totalCredits = visibleCourses.reduce(
    (total, course) => total + course.credits,
    0,
  );

  courseList.replaceChildren();

  visibleCourses.forEach((course) => {
    const card = document.createElement("article");
    card.className = `course-card${course.completed ? " completed" : ""}`;

    const name = document.createElement("div");
    name.className = "course-name";

    const code = document.createElement("span");
    code.className = "course-code";
    code.textContent = `${course.subject} ${course.number}`;

    const title = document.createElement("h3");
    title.textContent = course.title;

    const meta = document.createElement("div");
    meta.className = "course-meta";

    const credits = document.createElement("span");
    credits.className = "course-credits";
    credits.textContent = `${course.credits} credits`;

    name.append(code, title);
    meta.append(credits);

    if (course.completed) {
      const completionLabel = document.createElement("span");
      completionLabel.className = "completion-label";
      completionLabel.textContent = "Completed";
      meta.append(completionLabel);
      card.setAttribute("aria-label", `${course.title}, completed`);
    }

    card.append(name, meta);
    courseList.append(card);
  });

  courseSummary.textContent =
    `${visibleCourses.length} courses · ${totalCredits} credits`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    if (!filter) {
      return;
    }

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    renderCourses(filter);
  });
});

renderCourses();
