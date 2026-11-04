// ===== Week 3: JavaScript Practice Exercises =====
// Run any exercise in the terminal with:  node exercises.js
// Or paste a part of it into the browser console (F12 > Console).

// ---------- Exercise 1: Conditions (if / else if / else) ----------
function getGrade(marks) {
  if (marks >= 80) {
    return "A";
  } else if (marks >= 60) {
    return "B";
  } else if (marks >= 40) {
    return "C";
  } else {
    return "Fail";
  }
}
console.log("Exercise 1:", getGrade(85), getGrade(65), getGrade(30));

// ---------- Exercise 2: Loops (for and while) ----------
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}
console.log("Exercise 2 (sum of 1 to 10):", sum);

let count = 3;
while (count > 0) {
  console.log("Countdown:", count);
  count--;
}

// ---------- Exercise 3: Functions (declaration and arrow) ----------
function add(a, b) {
  return a + b;
}
const multiply = (a, b) => a * b;
console.log("Exercise 3:", add(4, 5), multiply(4, 5));

// ---------- Exercise 4: Arrays ----------
const skills = ["HTML", "CSS"];
skills.push("JavaScript");          // add to the end
skills.shift();                     // remove from the start
console.log("Exercise 4:", skills, "Length:", skills.length);

const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(n => n % 2 === 0);
const doubled = numbers.map(n => n * 2);
console.log("Even numbers:", evenNumbers);
console.log("Doubled:", doubled);

// ---------- Exercise 5: Objects ----------
const student = {
  name: "Zakia",
  city: "Lahore",
  skills: ["HTML", "CSS"]
};
student.age = 22;                   // add a property
student.city = "Lahore, Pakistan";  // update a property
console.log("Exercise 5:", student.name, student.city, student.age);

// ---------- Exercise 6: ES6 (template literals and destructuring) ----------
const { name, city } = student;
console.log(`Exercise 6: ${name} lives in ${city}.`);
