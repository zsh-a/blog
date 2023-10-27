---
title: sql
tag: sql
---

## SQL query
1. Generate a Cartesian product of the relations listed in the from clause.
2. Apply the predicates specified in the where clause on the result of Step 1.
3. For each tuple in the result of Step 2, output the attributes (or results of expressions) specified in the select clause.

### The Rename Operation

result column rename 

```sql
select name as instructor_name, course_id
from instructor, teaches
where instructor.ID= teaches.ID;
```

we wish to compare tuples in the same relation.

Find the names of all instructor whose salary is greater than at least one instructor in the **Biology** department.
```sql
select distinct T.name
from instructor as T, instructor as S
where T.salary > S.salary and S.dept_name='Biology';
```

### Basic String Operations

String concatenation (using `||`)
```sql
select 'hello' || 'world';
```
`upper(s)`,`lower(s)`,`trim(s)`

#### Pattern matching

* `%` matches any substring.
* `_` matches any character.

Using `like` expresses pattern

```sql
select dept
name
from department
where building like '%Watson%';
```

using `escape` define escape character

* `like 'ab∖%cd%' escape '∖'` matches all strings beginning with "ab%cd".
* `like 'ab∖∖cd%' escape '∖'` matches all strings beginning with "ab∖cd".
* 
#### Attribute Specification in the Select Clause
using `*` int the **select** to denote "all attributes"

```sql
select instructor.*
from instructor, teaches
where instructor.ID= teaches.ID;
```

#### Ordering the Display of Tuples

The **order by** clause causes the tuples in the result of a query to appear in sorted
order.
```sql
select *
from instructor
order by salary desc, name asc;
```

using the notation (v1, v2, … , vn) denote a tuple of arity n containing values v1, v2, … , vn;

```sql
select name, course_id
from instructor, teaches
where (instructor.ID, dept_name) = (teaches.ID, 'Biology');
```

### Set Operations
* The set of all courses taught in the Fall 2017 semester:
```sql
select course_id
from section
where semester = 'Fall' and year= 2017;
```
* The set of all courses taught in the Spring 2018 semester:
```sql
select course_id
from section
where semester = 'Spring' and year= 2018;
```
#### Union

Finding the set of all courses taught either in Fall 2017 or in Spring 2018, or both.

`union` elimates duplicates, `union all` retain duplicates.
```sql
(select course_id
from section
where semester = 'Fall' and year= 2017)
union
(select course_id
from section
where semester = 'Spring' and year= 2018);
```

#### Intersect
Finding the set of all courses taught in both the Fall 2017 and Spring 2018.
`intersect` elimates duplicates, `intersect all` retain duplicates.
```sql
(select course_id
from section
where semester = 'Fall' and year= 2017)
intersect
(select course_id
from section
where semester = 'Spring' and year= 2018);
```

#### Except
Finding all courses taught in the Fall 2017 semester but not in the Spring 2018 semester
```sql
(select course_id
from section
where semester = 'Fall' and year= 2017)
except
(select course_id
from section
where semester = 'Spring' and year= 2018);
```

### Aggregate Functions

* Average: `avg`
* Minimum: `min`
* Maximum: `max`
* Total: `sum`
* Count: `count`

#### Aggregation with Grouping
- The attribute or attributes given in the group by clause are used to form groups. 

Find the average salary in each department.
```sql
select dept_name, avg (salary) as avg_salary
from instructor
group by dept_name;
```

#### The Having Clause

a condition that applies to groups rather than to tuples.

Finding those departments where the average salary of the instructors is more than $42,000. 
```sql
select dept_name,avg(salary) as avg_salary
from salary
group by dept_name
having avg(salary) > 42000;
```

### Nested Subqueries

#### Set Membership

`in` or `not in` test for set membership

Find those courses that were taught in the Fall 2017 and that appear in the set of courses obtained in the subquery.

```sql
select distinct course_id
from section
where semester='Fall' and year=2017 and 
course_id in 
(select course_id
from section
where semester='Spring' and year=2018);
```

`in` and `not in` can be used on enumerated sets

```sql
select distinct name
from instructor
where name not in ('Mozart','Einstein');
```

#### Set Comparison

Find the names of all instructors whose salary is greater than at least one instructor in the Biology department.

`some` means at least one 

```sql
select name 
from instuctor
where salary > 
some(select salary
from instructor
where dept_name='Biology');
``` 

#### Subqueries in the From Clause

Find the average instructors’ salaries of those departments
where the average salary is greater than $42,000.
```sql
select dept_name, avg
salary
from (select dept_name, avg (salary) as avg_salary
from instructor
group by dept_name)
where avg_salary > 42000;
```

Find the maximum across all departments
of the total of all instructors’ salaries in each department.

```sql
select max(tot_salary)
from 
(select dept_name,sum(salary)
from instructor
group by dept_name) as dept_total(dept_name,tot_salary);
```

## Intermediate SQL

### Join Expressions

#### The Natural Join

The `natural join` operation, unlike Cartesian product of two relations, only considers those pairs of tuples with the same value on those attributes that appear in the schemas of both relations.

```sql
select name, course_id
from student, takes
where student.ID = takes.ID;
```
equals 

```sql
select name, course_id
from student natural join takes;
```

because two relations have the same attribute **ID**

The operation `join … using` requires a list of attribute to be specified. All attributes must have the same value.


List the names of students along with the titles of courses that they have taken.

```sql
select name,title
from student natural join tasks,course
where tasks.course_id == course.course_id;
```

note that `tasks.course_id` from the result of natural join and `course_id` is from tasks.

```sql
select name,title
from (student natural join tasks) join course using(course_id);
```

#### Join Conditions

The `on` condation allows a general predicate over the relation being joined.

```sql
select student.ID as ID, name, dept_name, tot_cred,
    course_id, sec_id, semester, year, grade
from student join takes on student.ID = takes.ID;
```

#### Outer Joins

The **out-join** preserve some tuples missed in join.

- `left outer join` preserve tuples only in the named before (to the left) **left outer join** operation.
- `right outer join` preserve tuples only in the named after (to the right) **right outer join** operation.
- The `full outer join` preserves tuples in both relations.

That do not preserve nonmatched tuples are called **inner join**.

outer join operation
1. compute inner join
2. for every tuples in the left relation that do not match any tuple in the right relation in the inner join, add a tuple with null of right attributes to the result 

Find all students who have not taken a course.
```sql
select ID
from student natural left outer join tasks
where course_id == null;
```

Display
a list of all students in the Comp. Sci. department, along with the course sections, if
any, that they have taken in Spring 2017; all course sections from Spring 2017 must be displayed, even if no student from the Comp. Sci. department has taken the course
section.

```sql
select *
from 
(select * from student where dept_name == 'Comp.Sci.')
natural full outer join 
(select * from tasks where semester == 'Spring' and year == 2017);
```

